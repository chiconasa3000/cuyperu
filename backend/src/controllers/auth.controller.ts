import type { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { ApiError } from '../middleware/errorHandler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, phone } = req.body;
    const data = await authService.register({ email, password, name, phone });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const user = await authService.getUserById(req.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const user = await authService.updateProfile(req.userId, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new ApiError(401, 'Authentication required');
    }
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.userId, currentPassword, newPassword);
    res.json({
      success: true,
      data: { message: 'Contraseña actualizada correctamente' },
    });
  } catch (error) {
    next(error);
  }
};