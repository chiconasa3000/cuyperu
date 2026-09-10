import type { NextFunction, Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import * as wishlistService from '../services/wishlist.service';
import type { CartOwner } from '../middleware/cartIdentity';

const getOwner = (req: Request): CartOwner => {
  const owner = req.cartOwner;
  if (!owner || (!owner.userId && !owner.sessionId)) {
    throw new Error('Owner not resolved');
  }
  return owner;
};

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await cartService.getCart(getOwner(req));
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const item = await cartService.addToCart(getOwner(req), productId, quantity);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = String(req.params.productId);
    const { quantity } = req.body;
    const item = await cartService.updateCartItem(getOwner(req), productId, quantity);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = String(req.params.productId);
    const data = await cartService.removeCartItem(getOwner(req), productId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const mergeSessionCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId || !req.cartOwner?.sessionId) {
      return next(new Error('Faltan credenciales para la fusión'));
    }
    await cartService.migrateSessionCart(req.userId, req.cartOwner.sessionId);
    await wishlistService.migrateSessionWishlist(req.userId, req.cartOwner.sessionId);
    const items = await cartService.getCart({ userId: req.userId });
    const wishlist = await wishlistService.getWishlist({ userId: req.userId });
    res.json({ success: true, data: items, wishlist });
  } catch (error) {
    next(error);
  }
};