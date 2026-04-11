import { Request, Response } from "express";
import { ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createUser, validateUser } from "./auth.services.js";
import { loginSchema, signupSchema } from "./auth.schema.js";

/**
 * @route POST /signup
 * @body { email, password, name, username? }
 * @returns { message, token, userInfo }
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const validation = signupSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Validation errors", errors);
  }

  const { user, token } = await createUser(validation.data);

  res.status(201).json({
    message: "User successfully created",
    token,
    userInfo: {
      id: user.id,
      name: user.name,
      userName: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

/**
 * @route POST /login
 * @body { email, password }
 * @returns { message, token, userInfo }
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.issues.reduce<Record<string, string>>(
      (acc, err) => {
        acc[err.path.join(".")] = err.message;
        return acc;
      },
      {},
    );
    throw new ValidationError("Validation errors", errors);
  }

  const { user, token } = await validateUser(validation.data);

  res.status(200).json({
    message: "Login successful",
    token,
    userInfo: {
      id: user.id,
      name: user.name,
      userName: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});
