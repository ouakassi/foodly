const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const expressWinston = require("express-winston");

const corsOptions = require("./configs/corsOptions");
const authenticateToken = require("./middlewares/authenticateToken");
const compressionConfig = require("./configs/compressionConfig");
const logsConfig = require("./configs/logsConfig");
const { dbLogger, errorsLogger, httpLogger } = require("./utils/logger");
const connectDb = require("./models");

const productRouter = require("./routes/productRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const addressRouter = require("./routes/addressRouter");
const adminRouter = require("./routes/adminRouter");
const authRole = require("./middlewares/authRole");
const uploadImageRouter = require("./routes/uploadImageRouter");
const orderRouter = require("./routes/orderRouter");

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
app.use(compression(compressionConfig));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();

app.use("/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter, addressRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadImageRouter);

// ❱❱ 2. 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❱❱ 3. Winston error logger (logs only, does NOT send headers)
app.use(
  expressWinston.errorLogger({
    winstonInstance: errorsLogger,
    statusLevels: true,
  })
);

// ❱❱ 4. Single global error handler -- sends exactly one response
app.use((err, req, res, next) => {
  console.error(err.stack); // helpful in dev
  if (res.headersSent) return next(err); // guard just in case
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
