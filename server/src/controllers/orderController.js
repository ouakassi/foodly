const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModal");

const Product = require("../models/productModel");

const sequelize = require("../utils/database");
const {
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
} = require("../utils/constants");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAndCountAll();
    if (orders.count === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ message: "all orders", orders });
  } catch (err) {
    return res.status(500).json({ message: "Failed to get all the orders." });
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

module.exports = {
  getAllOrders,
  getOrder,
  getUserOrders,
  createOrder,
  editOrder,
  updateOrderStatus,
};
