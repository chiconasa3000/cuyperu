import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { ApiError } from './errorHandler';

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}

interface CartIdentityRequest extends Request {
  cartOwner?: CartOwner;
}

declare module 'express-serve-static-core' {
  interface Request {
    cartOwner?: CartOwner;
  }
}

const SESSION_HEADER = 'x-session-id';

export const cartIdentity = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    let userId: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], env.jwtSecret) as {
          userId: string;
        };
        userId = decoded.userId;
        req.userId = userId;
      } catch {
        userId = undefined;
      }
    }

    const sessionId =
      typeof req.headers[SESSION_HEADER] === 'string'
        ? (req.headers[SESSION_HEADER] as string)
        : undefined;

    if (!userId && !sessionId) {
      throw new ApiError(401, 'Se requiere autenticación o una sesión');
    }

    (req as CartIdentityRequest).cartOwner = { userId, sessionId };
    next();
  } catch (error) {
    next(error);
  }
};