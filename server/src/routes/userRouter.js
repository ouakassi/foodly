const express = require("express");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).delete(deleteAllUsers);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = userRouter;
