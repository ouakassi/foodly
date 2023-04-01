const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
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
const roles = require("./utils/constants");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDb();

app.use("/auth", authRouter);
app.use("/api/products", authRole(roles.ADMIN), productRouter);
app.use("/api/users", userRouter, addressRouter);
app.use("/api/admin", adminRouter);

app.get("/error", (req, res) => {
  throw new Error("error");
});

app.use(
  expressWinston.errorLogger({
    winstonInstance: errorsLogger,
    statusLevels: true,
  })
);

module.exports = app;
