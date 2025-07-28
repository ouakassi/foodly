import express from "express";
import {
  getAllCategories,
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// Public routes (no authentication required)
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:categoryId", getCategoryById);
categoryRouter.get("/slug/:slug", getCategoryBySlug);
// categoryRouter.get("/:id/path", getCategoryPath);

// Protected routes (authentication required)
// categoryRouter.use(authenticateToken); // Apply authentication to all routes below

// Admin only routes
categoryRouter.post("/", createCategory);
categoryRouter.put("/:categoryId", updateCategory);
categoryRouter.patch("/restore/:categoryId", restoreCategory);
categoryRouter.delete("/:categoryId", deleteCategory);

export default categoryRouter;
