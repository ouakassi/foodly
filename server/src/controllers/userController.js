import Role from "../models/roleModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

// Get all users
// GET /api/users/
// Public

const getAllUsers = async (req, res) => {
  try {
    let { page, limit, role } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let filterConditions = {};

    if (role) {
      let roleRecord = await Role.findOne({ where: { name: role } });
      if (roleRecord) {
        filterConditions.roleId = roleRecord.id;
      }
    }

    const users = await User.findAll({
      where: filterConditions ? filterConditions : null,
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Role, as: "role", attributes: ["id", "name"] },
        { model: Order, as: "orders", attributes: ["id", "totalAmount"] },
      ],
      limit,
      offset: (page - 1) * limit,
    });
    if (users.length === 0) {
      return res.status(404).json({ message: "no users found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get user
// GET /api/users/:id
// Public

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: { id: userId },
      include: { model: Role, as: "role", attributes: ["id", "name"] },
    });

    if (!user) {
      res.status(404).json({ message: `user with id ${userId} not found ` });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update user
// PUT /api/users/:id
// Public
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }

    await updatedUser.update(userData);

    return res.status(200).json({
      message: `user with id ${userId} updated successfully`,
      updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete user
// DELETE /api/users/:id
// Public
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findOne({ where: { id: userId } });

    if (!deletedUser)
      return res.status(404).json({
        message: `user with id ${userId} not found !`,
      });
    else {
      await User.destroy({
        where: { id: userId },
      });
      return res.status(200).json({
        message: `user with id ${userId} deleted successfully`,
        deletedUser,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete all users
// DELETE /api/users/
// Public

const deleteAllUsers = async (req, res) => {
  try {
    const users = await await User.destroy({
      truncate: true,
    });
    if (users.length === 0) {
      return res.status(204).json({ message: "no users found" });
    } else {
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllUsers, getUser, updateUser, deleteUser, deleteAllUsers };
