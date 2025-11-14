import express from "express";

import {
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/productController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authRole from "../middlewares/authRole.js";
import { ROLES } from "../utils/constants.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(isAuthenticated, authRole(ROLES.ADMIN), getAllProducts)
  .post(isAuthenticated, authRole(ROLES.ADMIN), createProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(isAuthenticated, authRole(ROLES.ADMIN), updateProduct);

productRouter
  .route("/:id/delete")
  .put(isAuthenticated, authRole(ROLES.ADMIN), deleteProduct);

export default productRouter;
