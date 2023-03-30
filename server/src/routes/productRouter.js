const express = require("express");

const {
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
