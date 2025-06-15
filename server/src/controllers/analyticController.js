import { Op, fn, col, literal } from "sequelize";
import Order from "../models/orderModel.js";
import {
  ORDER_STATUS_VALUES_ARRAY,
  ORDER_STATUSES,
} from "../utils/constants.js";
import { validateAnalytics, validateDateRange } from "../utils/validator.js";

const getTotalSales = async (req, res) => {
  const { startDate, endDate } = req.query;
  const error = validateDateRange(startDate, endDate);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }
  try {
    const totalSales = await Order.sum("totalAmount", {
      where: {
        status: ORDER_STATUSES.COMPLETED,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    const formattedTotalSales = totalSales
      ? parseFloat(totalSales.toFixed(2)) // Ensure two decimal places
      : null; // Handle case where no sales are found

    res.json({
      message: "Total sales fetched successfully. ",
      dateRange: { startDate, endDate },
      totalSales,
      formattedTotalSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch total sales." });
  }
};

const getTotalOrders = async (req, res) => {
  const { startDate, endDate } = req.query;

  const error = validateDateRange(startDate, endDate);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  try {
    const totalOrders = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.json({ totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch total orders." });
  }
};

const getTotalOrdersByStatus = async (req, res) => {
  const { startDate, endDate } = req.query;
  const { status: orderStatus } = req.params;

  const error = validateDateRange(startDate, endDate);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }
  if (!ORDER_STATUS_VALUES_ARRAY.includes(orderStatus)) {
    return res.status(400).json({
      message: `Invalid status. Valid statuses are: ${ORDER_STATUS_VALUES_ARRAY.join(
        ", "
      )}`,
    });
  }

  try {
    const orders = await Order.count({
      where: {
        status: orderStatus || ORDER_STATUSES.PENDING,
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });

    res.json({
      message: "Total orders fetched successfully.",

      status: orderStatus,
      totalOrders: orders,
    });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No orders found for this status." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders by status." });
  }
};

const getDailyOrdersForMonth = async (req, res) => {
  const { month, year } = req.query;

  // Validate query params
  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  if (
    isNaN(parsedMonth) ||
    isNaN(parsedYear) || // Ensure both are numbers
    parsedMonth < 1 || // Months are 1-12
    parsedMonth > 12 || // Months are 1-12
    parsedYear < 1970 || // Assuming no orders before 1970
    parsedYear > new Date().getFullYear() // Prevent future dates
  ) {
    return res.status(400).json({ message: "Invalid month or year." });
  }

  // Calculate start and end dates of the month
  const startDate = new Date(parsedYear, parsedMonth - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);

  try {
    const dailyOrders = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("totalAmount")), "totalRevenue"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [literal("DATE(createdAt)")],
      order: [[literal("DATE(createdAt)"), "ASC"]],
      raw: true,
    });

    // Map results to easily build chart data
    const ordersMap = {};
    dailyOrders.forEach((order) => {
      const date =
        order.date instanceof Date
          ? order.date.toISOString().split("T")[0]
          : order.date; // raw mode might return string already
      ordersMap[date] = parseFloat(order.totalRevenue);
    });

    // Build result array including days with zero revenue
    const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();
    const chartData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(parsedYear, parsedMonth - 1, day);
      const dateStr = dateObj.toISOString().split("T")[0];
      chartData.push({
        date: dateStr,
        totalRevenue: ordersMap[dateStr] || 0,
      });
    }

    res.json({
      month: `${parsedYear}-${parsedMonth.toString().padStart(2, "0")}`,
      data: chartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch daily order analytics." });
  }
};
export {
  getTotalSales,
  getTotalOrders,
  getTotalOrdersByStatus,
  getDailyOrdersForMonth,
};
