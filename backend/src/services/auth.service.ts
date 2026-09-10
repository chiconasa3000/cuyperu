import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import env from '../config/env';
import { ApiError } from '../middleware/errorHandler';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface UpdateProfileInput {
  name?: string;
  phone?: string;
  email?: string;
}

const validateEmail = (email: string) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'Ingresa un email válido');
  }
};

const validatePassword = (password: string) => {
  if (!password || password.length < 8) {
    throw new ApiError(400, 'La contraseña debe tener al menos 8 caracteres');
  }
};

const signToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

export const sanitizeUser = (user: {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: Date;
}) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  createdAt: user.createdAt,
});

export const register = async (input: RegisterInput) => {
  const email = input.email?.trim().toLowerCase();
  validateEmail(email);
  validatePassword(input.password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, 'Ya existe una cuenta con este email');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: input.name?.trim() || null,
      phone: input.phone?.trim() || null,
    },
  });

  return {
    token: signToken(user.id),
    user: sanitizeUser(user),
  };
};

export const login = async (input: LoginInput) => {
  const email = input.email?.trim().toLowerCase();
  validateEmail(email);
  if (!input.password) {
    throw new ApiError(400, 'La contraseña es obligatoria');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  return {
    token: signToken(user.id),
    user: sanitizeUser(user),
  };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }
  return sanitizeUser(user);
};

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  if (input.email) {
    const email = input.email.trim().toLowerCase();
    validateEmail(email);

    const conflict = await prisma.user.findUnique({ where: { email } });
    if (conflict && conflict.id !== userId) {
      throw new ApiError(409, 'Ya existe una cuenta con este email');
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name ? { name: input.name.trim() } : {}),
      ...(input.phone ? { phone: input.phone.trim() } : {}),
      ...(input.email ? { email: input.email.trim().toLowerCase() } : {}),
    },
  });

  return sanitizeUser(user);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  validatePassword(newPassword);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'Usuario no encontrado');
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new ApiError(401, 'La contraseña actual es incorrecta');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};