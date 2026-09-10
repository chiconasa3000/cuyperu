import type { NextFunction, Request, Response } from 'express';
import * as productService from '../services/product.service';

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category, minPrice, maxPrice, search, sort, page, limit } = req.query;
    const data = await productService.listProducts({
      category: category as productService.Category,
      minPrice: minPrice === undefined ? undefined : Number(minPrice),
      maxPrice: maxPrice === undefined ? undefined : Number(maxPrice),
      search: search as string | undefined,
      sort: sort as productService.ListProductsParams['sort'],
      page: page === undefined ? undefined : Number(page),
      limit: limit === undefined ? undefined : Number(limit),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = String(req.params.slug);
    const product = await productService.getProductBySlug(slug);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getRelatedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const slug = String(req.params.slug);
    const product = await productService.getProductBySlug(slug);
    const related = await productService.getRelatedProducts(product.id);
    res.json({ success: true, data: related });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({ success: true, data: productService.getCategories() });
  } catch (error) {
    next(error);
  }
};