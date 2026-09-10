import type { NextFunction, Request, Response } from 'express';
import * as priceAlertService from '../services/priceAlert.service';
import { ApiError } from '../middleware/errorHandler';

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Inicia sesión para ver tus alertas');
    const alerts = await priceAlertService.getPriceAlerts(req.userId);
    res.json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Inicia sesión para crear una alerta');
    const { productId, targetPrice } = req.body;
    const alert = await priceAlertService.createPriceAlert(
      req.userId,
      productId,
      Number(targetPrice)
    );
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

export const deleteAlert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) throw new ApiError(401, 'Inicia sesión para gestionar tus alertas');
    const data = await priceAlertService.deletePriceAlert(req.userId, String(req.params.id));
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};