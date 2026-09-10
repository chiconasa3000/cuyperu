import type { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { ApiError } from '../middleware/errorHandler';

export type Category = 'COMMERCIAL' | 'MEDIUM' | 'LARGE' | 'BONELESS' | 'GOURMET';

export interface ListProductsParams {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

const VALID_CATEGORIES: Category[] = [
  'COMMERCIAL',
  'MEDIUM',
  'LARGE',
  'BONELESS',
  'GOURMET',
];

const SORT_ORDERS: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  newest: { createdAt: 'desc' },
  popular: { totalSales: 'desc' },
};

const parseNumber = (value: string | undefined, fallback: number, name: string) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new ApiError(400, `El parámetro ${name} no es válido`);
  }
  return parsed;
};

export const listProducts = async (params: ListProductsParams = {}) => {
  const page = parseNumber(String(params.page ?? 1), 1, 'page');
  const limit = Math.min(parseNumber(String(params.limit ?? 12), 12, 'limit'), 50);

  if (params.category) {
    const category = params.category.toUpperCase() as Category;
    if (!VALID_CATEGORIES.includes(category)) {
      throw new ApiError(400, 'Categoría no válida');
    }
  }

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(params.category ? { category: params.category.toUpperCase() as Category } : {}),
    ...(params.minPrice !== undefined
      ? { price: { gte: params.minPrice } }
      : {}),
    ...(params.maxPrice !== undefined
      ? { price: { ...(params.minPrice ? { gte: params.minPrice } : {}), lte: params.maxPrice } }
      : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: 'insensitive' } },
            { description: { contains: params.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: SORT_ORDERS[params.sort ?? ''] ?? { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
  });
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }
  return product;
};

export const getRelatedProducts = async (productId: string, limit = 4) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new ApiError(404, 'Producto no encontrado');
  }

  const sameCategory = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category: product.category,
      isActive: true,
    },
    take: limit,
  });

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  const relatedIds = sameCategory.map((p) => p.id);
  const fillCount = limit - sameCategory.length;

  const others = await prisma.product.findMany({
    where: {
      id: { notIn: [productId, ...relatedIds] },
      isActive: true,
      weightGrams: { gte: product.weightGrams - 100, lte: product.weightGrams + 200 },
    },
    take: fillCount,
  });

  const combined = [...sameCategory, ...others];
  if (combined.length >= limit) {
    return combined;
  }

  const existingIds = combined.map((p) => p.id);
  const remaining = await prisma.product.findMany({
    where: {
      id: { notIn: [productId, ...existingIds] },
      isActive: true,
    },
    take: limit - combined.length,
  });

  return [...combined, ...remaining];
};

export const getCategories = () => {
  return VALID_CATEGORIES.map((name) => ({
    name,
    label: {
      COMMERCIAL: 'Cuy Comercial',
      MEDIUM: 'Cuy Mediano',
      LARGE: 'Cuy Grande',
      BONELESS: 'Cuy Deshuesado',
      GOURMET: 'Cuy Gourmet',
    }[name],
    weightGrams: {
      COMMERCIAL: 300,
      MEDIUM: 400,
      LARGE: 500,
      BONELESS: 300,
      GOURMET: 300,
    }[name],
  }));
};