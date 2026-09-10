import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';

export const getPriceAlerts = async (userId: string) => {
  return prisma.priceAlert.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const createPriceAlert = async (
  userId: string,
  productId: string,
  targetPrice: number
) => {
  if (!productId || targetPrice == null || Number.isNaN(targetPrice)) {
    throw new ApiError(400, 'Producto y precio objetivo son obligatorios');
  }
  if (targetPrice <= 0) {
    throw new ApiError(400, 'El precio objetivo debe ser mayor a 0');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  if (Number(product.price) <= targetPrice) {
    throw new ApiError(400, 'El precio objetivo debe ser menor al precio actual');
  }

  const existing = await prisma.priceAlert.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    return prisma.priceAlert.update({
      where: { id: existing.id },
      data: { targetPrice, isActive: true },
      include: { product: true },
    });
  }

  return prisma.priceAlert.create({
    data: { userId, productId, targetPrice },
    include: { product: true },
  });
};

export const deletePriceAlert = async (userId: string, alertId: string) => {
  const alert = await prisma.priceAlert.findFirst({
    where: { id: alertId, userId },
  });
  if (!alert) {
    throw new ApiError(404, 'Alerta no encontrada');
  }
  await prisma.priceAlert.delete({ where: { id: alert.id } });
  return { message: 'Alerta eliminada' };
};