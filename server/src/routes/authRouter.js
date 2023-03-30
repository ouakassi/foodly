const express = require("express");

const {
  register,
  login,
  logout,
  loggedIn,
} = require("../controllers/authController");

const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(logout);
authRouter.route("/loggedin").get(loggedIn);

module.exports = authRouter;
