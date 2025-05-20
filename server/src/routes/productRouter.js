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
productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
