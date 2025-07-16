import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
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
  // isAuthenticated,
  // authRole(ROLES.ADMIN),
  adminRegister
);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(logout);
authRouter.route("/loggedin").get(loggedIn);

export default authRouter;
