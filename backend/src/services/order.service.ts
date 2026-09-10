import type { PaymentMethod } from '@prisma/client';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import { orderEvent } from './events';

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutInput {
  items: CheckoutItem[];
  paymentMethod: PaymentMethod;
  shippingAddress: unknown;
  notes?: string;
}

const VALID_PAYMENT_METHODS: PaymentMethod[] = [
  'VISA',
  'MASTERCARD',
  'PAYPAL',
  'BANK_TRANSFER',
  'CASH_ON_DELIVERY',
];

const validatePayment = (method: PaymentMethod) => {
  if (!VALID_PAYMENT_METHODS.includes(method)) {
    throw new ApiError(400, 'Método de pago no válido');
  }
};

const validateItems = (items: CheckoutItem[]): CheckoutItem[] => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'El carrito está vacío');
  }

  const seen = new Map<string, number>();
  for (const item of items) {
    if (!item.productId || !item.quantity) {
      throw new ApiError(400, 'Artículo de pedido no válido');
    }
    if (item.quantity < 1) {
      throw new ApiError(400, 'La cantidad debe ser al menos 1');
    }
    seen.set(item.productId, (seen.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(seen, ([productId, quantity]) => ({ productId, quantity }));
};

export const checkout = async (userId: string, input: CheckoutInput) => {
  validatePayment(input.paymentMethod);
  const items = validateItems(input.items);

  if (!input.shippingAddress) {
    throw new ApiError(400, 'La dirección de envío es obligatoria');
  }

  return prisma.$transaction(async (tx) => {
    const productIds = items.map((i) => i.productId);
    const products = await tx.product.findMany({ where: { id: { in: productIds } } });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = new Prisma.Decimal(0);
    const orderItems: {
      productId: string;
      quantity: number;
      priceAtPurchase: Prisma.Decimal;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || !product.isActive) {
        throw new ApiError(404, `Producto no disponible: ${item.productId}`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new ApiError(
          409,
          `Stock insuficiente para ${product.name} (solo ${product.stockQuantity})`
        );
      }

      totalAmount = totalAmount.plus(product.price.mul(item.quantity));
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        status: 'PENDING',
        totalAmount,
        paymentMethod: input.paymentMethod,
        shippingAddress: input.shippingAddress as Prisma.InputJsonValue,
        notes: input.notes ?? null,
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
          totalSales: { increment: item.quantity },
        },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId } });

    return order;
  }).then(async (order) => {
    const orderNumber = order.id.slice(0, 8).toUpperCase();
    const summary = order.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));
    await orderEvent('created', {
      orderId: order.id,
      orderNumber,
      userId,
      totalAmount: order.totalAmount.toString(),
      paymentMethod: order.paymentMethod,
      items: summary,
    });
    return order;
  });
};

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: true } },
    },
  });
  if (!order) {
    throw new ApiError(404, 'Pedido no encontrado');
  }
  return order;
};