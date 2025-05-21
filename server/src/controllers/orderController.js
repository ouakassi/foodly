import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModal.js";

import Product from "../models/productModel.js";

import sequelize from "../utils/database.js";
import {
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
  ORDER_SORT_OPTIONS,
} from "../utils/constants.js";

import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";
import {
  handleValidationError,
  validateOrderQuery,
} from "../utils/validator.js";
import emailQueue from "../utils/emailQueue.js";

const getAllOrders = async (req, res) => {
  try {
    const { error, value } = validateOrderQuery(req.query);
    if (error) return handleValidationError(error, res);

    let {
      page,
      limit,
      search,
      sort,
      status,
      paymentMethod,
      startDate,
      endDate,
    } = value;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive integers." });
    }

    let filterConditions = {};

    if (status) {
      filterConditions.status = status;
    }

    if (paymentMethod) {
      filterConditions.paymentMethod = paymentMethod;
    }

    if (startDate && endDate) {
      filterConditions.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    if (search) {
      filterConditions = {
        [Op.or]: [
          { id: { [Op.like]: `%${search}%` } },
          { "$user.firstName$": { [Op.like]: `%${search}%` } },
          { "$user.lastName$": { [Op.like]: `%${search}%` } },
          { "$user.email$": { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { count, rows } = await Order.findAndCountAll({
      where: filterConditions,
      include: [
        {
          model: User,
          as: "user",
          required: true, // ✅ Ensures JOIN is applied so WHERE on user.* works
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      order:
        sort && ORDER_SORT_OPTIONS[sort]
          ? [ORDER_SORT_OPTIONS[sort]]
          : [["createdAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
      distinct: true, // ✅ Fix overcounting due to joins
    });

    if (count === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for the given filters." });
    }

    return res.status(200).json({
      orders: rows,
      totalOrders: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      message: search ? "Search results" : "All orders retrieved successfully.",
      searchQuery: search || null,
      filters: filterConditions,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res
      .status(500)
      .json({ message: "Internal server error. Failed to fetch orders." });
  }
};

// ! problem when i request getOrder o get the order even if orderId is wrong
// ! i get nothing when hitting my-orders endpoint

const getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    console.log("Requested orderId:", orderId);

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product", // if you aliased this in your model
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order found", order });
  } catch (err) {
    return res.status(500).json({ message: "Failed to get the order." });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.user.id;

  console.log(userId);

  try {
    const orders = await Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: OrderItem,
          as: "items", // match the alias used in Order.hasMany
          include: [
            {
              model: Product,
              as: "product", // match the alias used in OrderItem.belongsTo
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      orders,
      message: orders.length === 0 ? "You have no orders." : undefined,
    });
  } catch (err) {
    console.error("Error fetching user's orders:", err);
    return res.status(500).json({ message: "Failed to get your orders." });
  }
};

const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided." });
  }

  try {
    const result = await sequelize.transaction(async (t) => {
      let totalAmount = 0;

      // Validate products and calculate total
      for (const item of items) {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Product ${item.productId} not available or not enough stock.`
          );
        }

        totalAmount += product.price * item.quantity;
      }

      // Create Order
      const order = await Order.create(
        {
          userId,
          totalAmount,
          status: ORDER_STATUSES.PENDING,
          shippingAddress,
          paymentMethod,
        },
        { transaction: t }
      );

      // Create OrderItems and update stock
      for (const item of items) {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });

        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
          { transaction: t }
        );

        // Update stock
        product.stock -= item.quantity;
        await product.save({ transaction: t });
      }

      return order;
    });

    const fullOrder = await Order.findByPk(result.id, {
      include: [
        {
          model: User,
          as: "user",
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "price"],
            },
          ],
        },
      ],
    });

    const orderItems = fullOrder.items.map((item) => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price.toFixed(2),
    }));

    await emailQueue.add(
      {
        to: req.user.email,
        subject: "🧾 Your Foodly Order Confirmation",
        template: "orderConfirmation",
        context: {
          customerName: fullOrder.user.firstName,
          orderId: result.id,
          orderDate: new Date(result.createdAt).toLocaleDateString("en-US"),
          deliveryAddress: result.shippingAddress,
          paymentMethod: result.paymentMethod,
          totalAmount: result.totalAmount.toFixed(2),
          items: orderItems,
          orderLink: "http://localhost:3000/orders",
        },
      },
      {
        attempts: 3,
        backoff: 5000, // 5 seconds between retries
      }
    );

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: result });
  } catch (err) {
    console.error("Order creation failed:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // order ID
  const { status } = req.body;

  try {
    // Validate new status
    if (!ORDER_STATUS_VALUES_ARRAY.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated.", order });
  } catch (err) {
    console.error("Order update failed:", err);
    return res
      .status(500)
      .json({ message: err.message || "Internal Server Error." });
  }
};

const editOrder = async (req, res) => {
  const { orderId } = req.params;
  const { shippingAddress, paymentMethod } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found." });

    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    await order.save();

    return res.status(200).json({ message: "Order updated.", order });
  } catch (err) {
    console.error("Order update failed:", err);
    return res.status(500).json({ message: err.message });
  }
};

const editOrderAddress = async (req, res) => {
  const { orderId } = req.params;
  const { shippingAddress } = req.body;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.status !== ORDER_STATUSES.PENDING) {
      return res
        .status(400)
        .json({ message: "Address can only be updated for pending orders." });
    }

    order.shippingAddress = shippingAddress;
    await order.save();

    await sendEmail({
      to: req.user.email,
      subject: "Shipping Address Updated",
      html: `<p>The shipping address for your order <b>${order.id}</b> has been updated.</p>`,
    });

    return res
      .status(200)
      .json({ message: "Shipping address updated.", order });
  } catch (err) {
    console.error("Error updating address:", err);
    return res.status(500).json({ message: "Failed to update address." });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) return res.status(404).json({ message: "Order not found." });

    if (order.status !== ORDER_STATUSES.PENDING) {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled." });
    }

    order.status = ORDER_STATUSES.CANCELLED;
    await order.save();

    await sendEmail({
      to: req.user.email,
      subject: "Order Cancelled",
      html: `<p>Your order <b>${order.id}</b> has been cancelled.</p>`,
    });

    return res
      .status(200)
      .json({ message: "Order cancelled successfully.", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    return res.status(500).json({ message: "Failed to cancel order." });
  }
};

export {
  getAllOrders,
  getOrder,
  getUserOrders,
  createOrder,
  editOrder,
  editOrderAddress,
  updateOrderStatus,
  cancelOrder,
};
