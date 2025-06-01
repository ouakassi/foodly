import express from "express";

import {
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter.route("/:id").get(getProduct).put(updateProduct);

productRouter.route("/:id/delete").put(deleteProduct);

export default productRouter;
