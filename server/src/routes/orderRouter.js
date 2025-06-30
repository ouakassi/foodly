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
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authRole from "../middlewares/authRole.js";
import { ROLES } from "../utils/constants.js";
import { getOrderOverview } from "../controllers/overviewOrderController.js";

const orderRouter = express.Router();

orderRouter.route("/my-orders").get(isAuthenticated, getUserOrders);
orderRouter.route("/overview").get(getOrderOverview);

orderRouter
  .route("/")
  // .get(isAuthenticated, authRole(ROLES.ADMIN), getAllOrders)
  .get(getAllOrders)
  .post(isAuthenticated, createOrder);

orderRouter
  .route("/:orderId")
  // .get(isAuthenticated, authRole(ROLES.ADMIN), getOrder);
  .get(getOrder);

orderRouter
  .route("/:orderId/status")
  .patch(isAuthenticated, authRole(ROLES.ADMIN), updateOrderStatus);

orderRouter
  .route("/:orderId/edit")
  .patch(isAuthenticated, authRole(ROLES.ADMIN), editOrder);

orderRouter.route("/:orderId/address").patch(isAuthenticated, editOrderAddress);

orderRouter.route("/:orderId/cancel").patch(isAuthenticated, cancelOrder);

export default orderRouter;
