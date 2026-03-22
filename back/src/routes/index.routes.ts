import { Router } from "express";
import dbCheck from "../modules/test/test.js";
import { signup } from "../modules/auth/auth.controllers.js";

export const router: Router = Router();

// Test routes
router.get("/db", dbCheck);

// auth routes
router.post("/signup", signup);
