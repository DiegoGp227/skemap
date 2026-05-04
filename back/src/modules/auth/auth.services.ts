import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  InvalidResetTokenError,
  ExpiredResetTokenError,
} from "../../errors/appError.js";
import prisma from "../../db/prisma.js";
import { IAuthUser, ICreateUser, IUserResponse } from "./auth.types";
import { env } from "../../config/env.js";
import { sendPasswordResetEmail } from "../../lib/email.js";

export const createUser = async (
  userData: ICreateUser,
): Promise<{ user: IUserResponse; token: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new EmailAlreadyInUseError(userData.email);
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: passwordHash,
      name: userData.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.TOKEN_EXPIRATION as SignOptions["expiresIn"],
  });

  return { user, token };
};

export const validateUser = async (
  userData: IAuthUser,
): Promise<{ user: IUserResponse; token: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (!existingUser) {
    throw new InvalidCredentialsError(userData.email);
  }

  const isPasswordValid = await bcrypt.compare(
    userData.password,
    existingUser.password,
  );

  if (!isPasswordValid) {
    throw new InvalidCredentialsError(userData.email);
  }

  const user = {
    id: existingUser.id,
    name: existingUser.name,
    username: existingUser.username,
    email: existingUser.email,
    createdAt: existingUser.createdAt,
    updatedAt: existingUser.updatedAt,
  };

  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: env.TOKEN_EXPIRATION as SignOptions["expiresIn"],
  });

  return { user, token };
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return silently to prevent user enumeration
  if (!user) return;

  // Invalidate any previous tokens for this user
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token: rawToken, userId: user.id, expiresAt },
  });

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetLink);
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.used) {
    throw new InvalidResetTokenError();
  }

  if (resetToken.expiresAt < new Date()) {
    throw new ExpiredResetTokenError();
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);
};
