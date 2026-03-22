import { Request, Response } from "express";
import { AppError, InternalServerError, ValidationError } from "../../errors/appError";
import { createUser } from "./auth.services";
import { signupSchema } from "./auth.shema";

/**
 * @route POST /signup
 * @body { email, password, name, username? }
 * @returns { message, token, userInfo }
 */

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      const errors = validation.error.issues.reduce(
        (acc: Record<string, string>, err: any) => {
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
  } catch (error) {
    console.error("❌ Error in the signup:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
