import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import authRole from "../middlewares/authRole.js";
import {
  publicRegister,
  adminRegister,
  login,
  logout,
  loggedIn,
} from "../controllers/authController.js";
import { ROLES } from "../utils/constants.js";

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

export default authRouter;
