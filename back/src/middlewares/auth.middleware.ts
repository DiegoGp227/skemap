import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { InternalServerError, UnauthorizedError } from "../errors/appError";

// Un middleware es una función que se ejecuta ANTES del controller.Los 
// Express le pasa (req, res, next):
//   - req/res: igual que en el controller
//   - next: función para pasar al siguiente eslabón (el controller)
//           si no llamas a next(), la petición se queda colgada

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // jwt.verify lanza JsonWebTokenError si el token es inválido o expiró
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    ) as { id: number; email: string };

    // Adjuntamos el usuario al request para que cualquier controller
    // que venga después pueda acceder a él via req.user
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // Llamamos a next() para continuar al controller
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      const unauthorized = new UnauthorizedError("Invalid or expired token");
      res.status(unauthorized.statusCode).json(unauthorized.toJSON());
      return;
    }

    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).json(error.toJSON());
      return;
    }

    const internalError = new InternalServerError("Internal server error");
    res.status(internalError.statusCode).json(internalError.toJSON());
  }
};
