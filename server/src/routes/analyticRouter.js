import express from "express";
import {
  getTotalSales,
  getTotalOrders,
  getTotalOrdersByStatus,
  getDailyOrdersForMonth,
  // getOrdersByStatus,
  // getTopProducts,
  // getRevenuePerDay,
} from "../controllers/analyticController.js";

const analyticRouter = express.Router();

analyticRouter.get("/total-sales", getTotalSales);
analyticRouter.get("/total-orders", getTotalOrders);
analyticRouter.get("/total-orders/:status", getTotalOrdersByStatus);
analyticRouter.get("/daily-orders", getDailyOrdersForMonth);

// analyticRouter.get("/top-products", getTopProducts);
// analyticRouter.get("/revenue-per-day", getRevenuePerDay);

export default analyticRouter;
