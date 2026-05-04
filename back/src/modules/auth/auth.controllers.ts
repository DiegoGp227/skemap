import { Request, Response } from "express";
import { ValidationError } from "../../errors/appError.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createUser, validateUser, requestPasswordReset, resetPassword } from "./auth.services.js";
import { loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.schema.js";

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

/**
 * @route POST /forgot-password
 * @body { email }
 * @returns { message }
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const validation = forgotPasswordSchema.safeParse(req.body);

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

  await requestPasswordReset(validation.data.email);

  res.status(200).json({ message: "If that email exists, a reset link has been sent" });
});

/**
 * @route POST /reset-password
 * @body { token, password }
 * @returns { message }
 */
export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const validation = resetPasswordSchema.safeParse(req.body);

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

  await resetPassword(validation.data.token, validation.data.password);

  res.status(200).json({ message: "Password updated successfully" });
});
