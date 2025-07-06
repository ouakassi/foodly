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
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getUserOverview } from "../controllers/overviewUserController.js";

const userRouter = express.Router();

userRouter
  .route("/")
  // .get(isAuthenticated, authRole(ROLES.ADMIN), getAllUsers)
  .get(getAllUsers)

  .delete(isAuthenticated, authRole(ROLES.ADMIN), deleteAllUsers);
userRouter.route("/overview").get(getUserOverview);
userRouter
  .route("/:id")
  .get(isAuthenticated, getUser)
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, authRole(ROLES.ADMIN), deleteUser);

export default userRouter;
