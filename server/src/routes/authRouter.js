const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const authRole = require("../middlewares/authRole");
const {
  publicRegister,
  adminRegister,
  login,
  logout,
  loggedIn,
} = require("../controllers/authController");
const { ROLES } = require("../utils/constants");

const authRouter = express.Router();

authRouter.route("/register").post(publicRegister);
authRouter.post(
  "/admin/register",
  authenticateToken,
  authRole(ROLES.ADMIN),
  adminRegister
);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(logout);
authRouter.route("/loggedin").get(loggedIn);

module.exports = authRouter;
