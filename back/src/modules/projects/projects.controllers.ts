import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError, InternalServerError, UnauthorizedError } from "../../errors/appError";
import { getProjectsByUser } from "./projects.services";

/**
 * @route   GET /projects
 * @headers Authorization: Bearer <token>
 * @access  Private (requiere autenticación)
 * @returns { projects: Project[] }
 */
export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    ) as { id: string; email: string };

    const projects = await getProjectsByUser(decoded.id);

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("❌ Error in getProjects:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      const unauthorized = new UnauthorizedError("Invalid or expired token");
      res.status(unauthorized.statusCode).json(unauthorized.toJSON());
      return;
    }

    if (error instanceof AppError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
