import express from "express";
import {
  handleStripeWebhook,
  createStripeCheckout,
} from "../controllers/stripeController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, createStripeCheckout);

// Webhook should NOT use body-parser! Use raw body:
stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export default stripeRoutes;
