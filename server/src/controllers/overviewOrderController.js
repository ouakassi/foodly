import { Op } from "sequelize";

import {
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
} from "../utils/constants.js";
import { validateDateRange } from "../utils/validator.js";
import { getPreviousDateRange } from "../utils/helpers.js";
import Order from "../models/orderModel.js";

const getOrderOverview = async (req, res) => {
  const { startDate, endDate } = req.query;

  console.log(startDate);
  const error = validateDateRange(startDate, endDate);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  try {
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);
    const { prevStart, prevEnd } = getPreviousDateRange(
      currentStart,
      currentEnd
    );

    // Run all queries in parallel for better performance
    const [
      totalOrders,
      totalOrdersPrevious,
      totalRevenue,
      totalRevenuePrevious,
      pendingOrders,
      cancelledOrders,
      completedOrders,
      shippedOrders,
      deliveredOrders,
      avgOrderValue,
      avgOrderValuePrevious,
      dailyOrderStats,
    ] = await Promise.all([
      // Current period total orders
      Order.count({
        where: {
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      // Previous period total orders
      Order.count({
        where: {
          createdAt: { [Op.between]: [prevStart, prevEnd] },
        },
      }),

      // Current period revenue (completed orders only)
      Order.sum("totalAmount", {
        where: {
          status: ORDER_STATUSES.COMPLETED,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      // Previous period revenue (completed orders only)
      Order.sum("totalAmount", {
        where: {
          status: ORDER_STATUSES.COMPLETED,
          createdAt: { [Op.between]: [prevStart, prevEnd] },
        },
      }),

      // Status-specific counts for current period
      Order.count({
        where: {
          status: ORDER_STATUSES.PENDING,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUSES.CANCELLED,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUSES.COMPLETED,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUSES.SHIPPED,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      Order.count({
        where: {
          status: ORDER_STATUSES.DELIVERED,
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
      }),

      // Average order value for current period
      Order.findOne({
        attributes: [
          [
            Order.sequelize.fn("AVG", Order.sequelize.col("totalAmount")),
            "avgOrderValue",
          ],
        ],
        where: {
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
        raw: true,
      }),

      // Average order value for previous period
      Order.findOne({
        attributes: [
          [
            Order.sequelize.fn("AVG", Order.sequelize.col("totalAmount")),
            "avgOrderValue",
          ],
        ],
        where: {
          createdAt: { [Op.between]: [prevStart, prevEnd] },
        },
        raw: true,
      }),

      // Daily order breakdown for current period
      Order.findAll({
        attributes: [
          [
            Order.sequelize.fn("DATE", Order.sequelize.col("createdAt")),
            "date",
          ],
          [
            Order.sequelize.fn("COUNT", Order.sequelize.col("id")),
            "orderCount",
          ],
          [
            Order.sequelize.fn("SUM", Order.sequelize.col("totalAmount")),
            "dailyRevenue",
          ],
        ],
        where: {
          createdAt: { [Op.between]: [currentStart, currentEnd] },
        },
        group: [Order.sequelize.fn("DATE", Order.sequelize.col("createdAt"))],
        order: [
          [Order.sequelize.fn("DATE", Order.sequelize.col("createdAt")), "ASC"],
        ],
        raw: true,
      }),
    ]);

    // Calculate percentage changes
    const orderGrowth =
      totalOrdersPrevious > 0
        ? ((totalOrders - totalOrdersPrevious) / totalOrdersPrevious) * 100
        : 0;

    const revenueGrowth =
      totalRevenuePrevious > 0
        ? ((totalRevenue - totalRevenuePrevious) / totalRevenuePrevious) * 100
        : 0;

    const avgOrderGrowth =
      avgOrderValuePrevious?.avgOrderValue > 0
        ? ((avgOrderValue?.avgOrderValue -
            avgOrderValuePrevious?.avgOrderValue) /
            avgOrderValuePrevious?.avgOrderValue) *
          100
        : 0;

    // Calculate conversion rate (completed orders / total orders)
    const conversionRate =
      totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Calculate cancellation rate
    const cancellationRate =
      totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

    return res.json({
      period: {
        startDate: currentStart.toISOString(),
        endDate: currentEnd.toISOString(),
      },
      previousPeriod: {
        startDate: prevStart.toISOString(),
        endDate: prevEnd.toISOString(),
      },

      // Core metrics
      totalOrders,
      totalOrdersPrevious,
      orderGrowth: parseFloat(orderGrowth.toFixed(2)),

      totalRevenue: parseFloat((totalRevenue || 0).toFixed(2)),
      totalRevenuePrevious: parseFloat((totalRevenuePrevious || 0).toFixed(2)),
      revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),

      averageOrderValue: parseFloat(
        (avgOrderValue?.avgOrderValue || 0).toFixed(2)
      ),
      averageOrderValuePrevious: parseFloat(
        (avgOrderValuePrevious?.avgOrderValue || 0).toFixed(2)
      ),
      avgOrderGrowth: parseFloat(avgOrderGrowth.toFixed(2)),

      // Order status breakdown
      ordersByStatus: {
        pending: pendingOrders,
        cancelled: cancelledOrders,
        completed: completedOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },

      // Performance metrics
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      cancellationRate: parseFloat(cancellationRate.toFixed(2)),

      // Daily breakdown
      dailyStats: dailyOrderStats.map((stat) => ({
        date: stat.date,
        orderCount: parseInt(stat.orderCount),
        revenue: parseFloat((stat.dailyRevenue || 0).toFixed(2)),
      })),

      // Legacy fields (for backward compatibility)
      totalOrdersPending: pendingOrders,
      totalOrdersCancelled: cancelledOrders,
      totalOrdersCompleted: completedOrders,
    });
  } catch (err) {
    console.error("Error fetching order overview:", err);
    res.status(500).json({
      message: "Failed to fetch order overview data.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const getFofo = async (req, res) => {
  return res.json({
    message: "Fofo endpoint is working!",
  });
};

export { getOrderOverview, getFofo };
