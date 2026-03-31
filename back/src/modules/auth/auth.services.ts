import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
} from "../../errors/businessErrors";
import prisma from "../../db/prisma.js";
import { IAuthUser, ICreateUser, IUserResponse } from "./auth.types";

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

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    {
      expiresIn: (process.env.TOKEN_EXPIRATION || "1h") as string,
    } as SignOptions,
  );

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

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || "default_secret",
    {
      expiresIn: (process.env.TOKEN_EXPIRATION || "1h") as string,
    } as SignOptions,
  );

  return { user, token };
};
