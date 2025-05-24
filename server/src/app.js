import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import expressWinston from "express-winston";

import corsOptions from "./configs/corsOptions.js";
import compressionConfig from "./configs/compressionConfig.js";
import logsConfig from "./configs/logsConfig.js";
import { dbLogger, errorsLogger, httpLogger } from "./utils/logger.js";
import connectDb from "./models/index.js";

import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import addressRouter from "./routes/addressRouter.js";
import uploadImageRouter from "./routes/uploadImageRouter.js";
import orderRouter from "./routes/orderRouter.js";
// import stripeRouter from "./routes/stripeRouter.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: logsConfig }));
}
app.use(
  expressWinston.logger({
    winstonInstance: httpLogger,
    dbLogger,
    statusLevels: true,
  })
);

// ❱❱ Middleware
app.use(compression(compressionConfig));

// ✅ Stripe webhook route with raw body parser MUST come before express.json()
// app.use("/api/stripe", stripeRouter);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();

// ❱❱  Routes
app.use("/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter, addressRouter);
app.use("/api/upload", uploadImageRouter);

// ❱❱  404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❱❱  Winston error logger (logs only, does NOT send headers)
app.use(
  expressWinston.errorLogger({
    winstonInstance: errorsLogger,
    statusLevels: true,
  })
);

// ❱❱  Single global error handler -- sends exactly one response
app.use((err, req, res, next) => {
  console.error(err.stack); // helpful in dev
  if (res.headersSent) return next(err); // guard just in case
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
