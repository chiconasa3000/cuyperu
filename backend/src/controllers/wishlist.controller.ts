import type { NextFunction, Request, Response } from 'express';
import * as wishlistService from '../services/wishlist.service';
import type { CartOwner } from '../middleware/cartIdentity';

const getOwner = (req: Request): CartOwner => {
  const owner = req.cartOwner;
  if (!owner || (!owner.userId && !owner.sessionId)) {
    throw new Error('Owner not resolved');
  }
  return owner;
};

export const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await wishlistService.getWishlist(getOwner(req));
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = String(req.params.productId);
    const item = await wishlistService.addToWishlist(getOwner(req), productId);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = String(req.params.productId);
    const data = await wishlistService.removeFromWishlist(getOwner(req), productId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};