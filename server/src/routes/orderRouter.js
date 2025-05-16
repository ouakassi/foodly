const express = require("express");

const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  editOrder,
  getUserOrders,
} = require("../controllers/orderController");
const authenticateToken = require("../middlewares/authenticateToken");
const authRole = require("../middlewares/authRole");
const { ROLES } = require("../utils/constants");

const orderRouter = express.Router();

orderRouter.route("/my-orders").get(authenticateToken, getUserOrders);

orderRouter
  .route("/")
  .get(authenticateToken, authRole(ROLES.ADMIN), getAllOrders)
  .post(authenticateToken, createOrder);
orderRouter
  .route("/:orderId")
  .get(authenticateToken, authRole(ROLES.ADMIN), getOrder);

orderRouter
  .route("/:orderId/status")
  .patch(authenticateToken, authRole(ROLES.ADMIN), updateOrderStatus);
orderRouter
  .route("/:orderId/edit")
  .patch(authenticateToken, authRole(ROLES.ADMIN), editOrder);

module.exports = orderRouter;
