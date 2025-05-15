const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModal");

const Product = require("../models/productModel");

const sequelize = require("../utils/database");

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAndCountAll();
    if (orders.count === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);

    if (!order) {
      res.status(404).json({ message: "order not found" });
    }
    return res
      .status(200)
      .json({ message: `order with id ${orderId} been found!`, order });
  } catch (err) {
    next(err);
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
          status: "pending",
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

    res
      .status(201)
      .json({ message: "Order placed successfully", order: result });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
};
