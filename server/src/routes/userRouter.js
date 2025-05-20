import express from "express";

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from "../controllers/userController.js";
import authRole from "../middlewares/authRole.js";
import { ROLES } from "../utils/constants.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(authenticateToken, authRole(ROLES.ADMIN), getAllUsers)
  .delete(authenticateToken, authRole(ROLES.ADMIN), deleteAllUsers);
userRouter
  .route("/:id")
  .get(authenticateToken, getUser)
  .put(authenticateToken, updateUser)
  .delete(authenticateToken, authRole(ROLES.ADMIN), deleteUser);

export default userRouter;
