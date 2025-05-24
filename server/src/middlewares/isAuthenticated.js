import jwt from "jsonwebtoken";
import { verifyJWT } from "../utils/auth.js";
import { log } from "../utils/logger.js";

// middleware function for authentication:
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      log("error", "error", "unauthorized", {
        message: "unauthorized",
        status: 401,
      });
      return;
    }
    const verifiedUser = verifyJWT(token);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "not valid user" });
    log("error", "error", "not valid user", {
      message: "not valid user",
      status: 401,
    });
    return;
  }
};

export default isAuthenticated;
