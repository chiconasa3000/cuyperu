import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';
import type { CartOwner } from '../middleware/cartIdentity';

const ownerFilter = (owner: CartOwner) =>
  owner.userId ? { userId: owner.userId } : { sessionId: owner.sessionId };

export const getWishlist = async (owner: CartOwner) => {
  return prisma.wishlist.findMany({
    where: ownerFilter(owner),
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const isWishlisted = async (owner: CartOwner, productId: string) => {
  const count = await prisma.wishlist.count({
    where: { ...ownerFilter(owner), productId },
  });
  return count > 0;
};

export const addToWishlist = async (owner: CartOwner, productId: string) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const filter = ownerFilter(owner);
  const existing = await prisma.wishlist.findFirst({
    where: { ...filter, productId },
  });
  if (existing) return existing;

  return prisma.wishlist.create({
    data: {
      ...(owner.userId ? { userId: owner.userId } : { sessionId: owner.sessionId }),
      productId,
    },
    include: { product: true },
  });
};

export const removeFromWishlist = async (owner: CartOwner, productId: string) => {
  const item = await prisma.wishlist.findFirst({
    where: { ...ownerFilter(owner), productId },
  });
  if (!item) {
    throw new ApiError(404, 'El producto no está en favoritos');
  }
  await prisma.wishlist.delete({ where: { id: item.id } });
  return { message: 'Producto eliminado de favoritos' };
};

export const migrateSessionWishlist = async (userId: string, sessionId: string) => {
  const sessionItems = await prisma.wishlist.findMany({
    where: { sessionId },
  });
  if (sessionItems.length === 0) return;

  for (const item of sessionItems) {
    const existing = await prisma.wishlist.findFirst({
      where: { userId, productId: item.productId },
    });
    if (!existing) {
      await prisma.wishlist.create({
        data: { userId, productId: item.productId },
      });
    }
  }

  await prisma.wishlist.deleteMany({ where: { sessionId } });
};