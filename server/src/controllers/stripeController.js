import Stripe from "stripe";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
import User from "../models/userModel.js";
import emailQueue from "../utils/emailQueue.js";
import { ORDER_STATUSES } from "../utils/constants.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createStripeCheckout = async (req, res) => {
  const { items, shippingAddress } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items provided." });
  }

  try {
    let totalAmount = 0;

    const productData = [];
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Product ${item.productId} not available.` });
      }

      totalAmount += product.price * item.quantity;

      productData.push({
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image, // optional
        productId: item.productId,
      });
    }

    // Create pending order
    const pendingOrder = await Order.create({
      userId,
      totalAmount,
      status: ORDER_STATUSES.PENDING,
      shippingAddress,
      paymentMethod: "stripe",
    });

    // Optional: Save pending items (but don't decrement stock yet)
    for (const item of productData) {
      await OrderItem.create({
        orderId: pendingOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Create Stripe Checkout Session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      line_items: productData.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [], // Handle optional image
          },
          unit_amount: Math.round(item.price * 100), // Price in cents
        },
        quantity: item.quantity,
      })),

      metadata: {
        orderId: pendingOrder.id,
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ message: "Stripe Checkout creation failed" });
  }
};

const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Invalid webhook signature:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true }); // Ignore irrelevant events
  }

  const session = event.data.object;
  const orderId = session.metadata.orderId;

  try {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: "items" }],
    });

    if (!order || order.status !== ORDER_STATUSES.PENDING) {
      return res
        .status(404)
        .json({ message: "Order not found or already processed." });
    }

    // Check stock and deduct
    let stockIssue = false;

    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);

      if (!product || product.stock < item.quantity) {
        stockIssue = true;
        console.error(`❌ Insufficient stock for product ID ${item.productId}`);
        break;
      }
    }

    if (stockIssue) {
      order.status = ORDER_STATUSES.FAILED;
      await order.save();

      // Optionally notify admin here
      console.warn(
        `⚠️ Order ${order.id} marked as FAILED due to stock issue after payment`
      );

      return res.status(200).json({ received: true });
    }

    // Deduct stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Mark order as paid
    order.status = ORDER_STATUSES.PAID;
    await order.save();

    // Send confirmation email
    const user = await User.findByPk(order.userId);
    await emailQueue.add({
      to: user.email,
      subject: "🧾 Your Foodly Order Confirmation",
      template: "orderConfirmation",
      context: {
        customerName: user.firstName,
        orderId: order.id,
        orderDate: new Date(order.createdAt).toLocaleDateString("en-US"),
        deliveryAddress: order.shippingAddress,
        paymentMethod: "Stripe",
        totalAmount: order.totalAmount.toFixed(2),
        items: order.items,
        orderLink: `${process.env.CLIENT_URL}/orders/${order.id}`,
      },
    });

    console.log(
      `✅ Order ${orderId} marked as PAID and confirmation email sent`
    );

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("🚨 Error handling Stripe webhook:", err);
    return res.status(500).send("Internal webhook error");
  }
};

export { createStripeCheckout, handleStripeWebhook };
