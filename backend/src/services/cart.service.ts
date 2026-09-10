import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import type { CartOwner } from '../middleware/cartIdentity';

const ownerFilter = (owner: CartOwner) =>
  owner.userId ? { userId: owner.userId } : { sessionId: owner.sessionId };

export const getCart = async (owner: CartOwner) => {
  const items = await prisma.cartItem.findMany({
    where: ownerFilter(owner),
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });
  return items;
};

export const addToCart = async (
  owner: CartOwner,
  productId: string,
  quantity = 1
) => {
  if (!productId) {
    throw new ApiError(400, 'El producto es obligatorio');
  }
  if (quantity < 1) {
    throw new ApiError(400, 'La cantidad debe ser al menos 1');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const filter = ownerFilter(owner);
  const existing = await prisma.cartItem.findFirst({ where: { ...filter, productId } });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: {
      ...(owner.userId ? { userId: owner.userId } : { sessionId: owner.sessionId }),
      productId,
      quantity,
    },
    include: { product: true },
  });
};

export const updateCartItem = async (
  owner: CartOwner,
  productId: string,
  quantity: number
) => {
  if (quantity < 1) {
    throw new ApiError(400, 'La cantidad debe ser al menos 1');
  }

  const item = await prisma.cartItem.findFirst({
    where: { ...ownerFilter(owner), productId },
  });
  if (!item) {
    throw new ApiError(404, 'El artículo no está en el carrito');
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
    include: { product: true },
  });
};

export const removeCartItem = async (owner: CartOwner, productId: string) => {
  const item = await prisma.cartItem.findFirst({
    where: { ...ownerFilter(owner), productId },
  });
  if (!item) {
    throw new ApiError(404, 'El artículo no está en el carrito');
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
  return { message: 'Artículo eliminado del carrito' };
};

export const clearCart = async (owner: CartOwner) => {
  await prisma.cartItem.deleteMany({ where: ownerFilter(owner) });
};

export const migrateSessionCart = async (userId: string, sessionId: string) => {
  const sessionItems = await prisma.cartItem.findMany({
    where: { sessionId },
  });
  if (sessionItems.length === 0) return;

  for (const item of sessionItems) {
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId: item.productId },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }
  }

  await prisma.cartItem.deleteMany({ where: { sessionId } });
};