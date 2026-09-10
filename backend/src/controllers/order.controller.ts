import type { NextFunction, Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { ApiError } from '../middleware/errorHandler';

export const checkout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Inicia sesión para completar tu compra');
    }
    const { items, paymentMethod, shippingAddress, notes } = req.body;
    const order = await orderService.checkout(req.userId, {
      items,
      paymentMethod,
      shippingAddress,
      notes,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Inicia sesión para ver tus pedidos');
    }
    const orders = await orderService.getOrders(req.userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Inicia sesión para ver tu pedido');
    }
    const order = await orderService.getOrderById(req.userId, String(req.params.id));
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};