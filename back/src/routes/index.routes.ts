import { Router } from "express";
import dbCheck from "../modules/test/test.js";
import { login, signup } from "../modules/auth/auth.controllers.js";
import {
  getProjects,
  getProject,
  getProjectsStats,
  createProject,
  updateProject,
  deleteProject,
} from "../modules/projects/projects.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router: Router = Router();

// Test Routes
router.get("/db", dbCheck);

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);

// Projects Routes
router.get("/projects", authMiddleware, getProjects);
router.get("/projects/stats", authMiddleware, getProjectsStats);
router.get("/projects/:id", authMiddleware, getProject);
router.post("/projects", authMiddleware, createProject);
router.patch("/projects/:id", authMiddleware, updateProject);
router.delete("/projects/:id", authMiddleware, deleteProject);
