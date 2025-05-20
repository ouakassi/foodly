import express from "express";

import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  editOrder,
  getUserOrders,
  editOrderAddress,
  cancelOrder,
} from "../controllers/orderController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import authRole from "../middlewares/authRole.js";
import { ROLES } from "../utils/constants.js";

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

orderRouter
  .route("/:orderId/address")
  .patch(authenticateToken, editOrderAddress);

orderRouter.route("/:orderId/cancel").patch(authenticateToken, cancelOrder);

export default orderRouter;
