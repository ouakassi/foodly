const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrder,
} = require("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");
const authRole = require("../middlewares/authRole");

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(authenticateToken, authRole("admin"), getAllOrders)
  .post(authenticateToken, createOrder);

orderRouter.route("/:orderId").get(authenticateToken, getOrder);

module.exports = orderRouter;
