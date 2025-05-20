import {
  hashPassword,
  createJWT,
  comparePasswords,
  verifyJWT,
} from "../utils/auth.js";
import {
  validateRegister,
  validateLogin,
  handleValidationError,
  validateAdminRegister,
} from "../utils/validator.js";

import User from "../models/userModel.js";
import Role from "../models/roleModel.js";

import { ROLES } from "../utils/constants.js";
import { log } from "../utils/logger.js";

// register public user
// POST /auth/register
// Public

const publicRegister = async (req, res) => {
  try {
    // Validate user inputs
    const { error, value } = validateRegister(req.body);

    // Return error message if user input is invalid
    if (error) {
      return handleValidationError(error, res);
    }

    // Extract user data from request body after validation
    const { firstName, lastName, email, password } = value;

    // Always assign USER role for public registrations
    const roleRecord = await Role.findOne({ where: { name: ROLES.USER } });
    if (!roleRecord)
      return res.status(400).json({ message: "User role missing" });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exists` });
    }

    const hashedPassword = await hashPassword(password);
    // Create new user in the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: roleRecord.id,
    });

    // Generate JWT token
    const token = createJWT(newUser);

    // Set cookie with the JWT token
    res.cookie("token", token, {
      httpOnly: true,
    });

    // Return success message and user data
    res
      .status(201)
      .json({ message: `User created successfully`, user: newUser });
  } catch (error) {
    // Return error message if an unexpected error occurs
    res.status(500).json({ error: error.message });
  }
};

// register admin user
// POST /auth/admin/register
// Private
const adminRegister = async (req, res) => {
  try {
    const { error, value } = validateAdminRegister(req.body);
    if (error) return handleValidationError(error, res);

    const { firstName, lastName, email, password } = value;
    const requestedRole = value.role || ROLES.USER;

    const roleRecord = await Role.findOne({ where: { name: requestedRole } });
    if (!roleRecord) return res.status(400).json({ message: "Invalid role" });

    // Only allow admin to assign elevated ROLES

    const isRequesterAdmin = req.user && req.user.roleId === roleRecord.id;
    const isCreatingAdmin = requestedRole === ROLES.ADMIN;

    if (isCreatingAdmin && !isRequesterAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can assign admin role" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: `Email already registered` });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: roleRecord.id,
    });

    const { id, email: createdEmail, roleId } = newUser;

    res.status(201).json({
      message: "User created by admin",
      user: { id, createdEmail, roleId },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login user
// POST /auth/login
// Public

const login = async (req, res) => {
  try {
    // Validate user inputs
    const { error, value } = validateLogin(req.body);

    // Return error message if user input is invalid
    if (error) {
      return handleValidationError(error, res);
    }

    // Extract user data from request body after validation
    const { email, password } = value;

    // Find user in database
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "role" }, // so you have access to role.name or role.id
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isValidPassword = await comparePasswords(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT token and set cookie
    const token = createJWT(user);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_LIFETIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    };

    res.cookie("token", token, cookieOptions);

    // Return success message and user ID
    res.status(200).json({
      message: "Logged in successfully!",
      // userId: user.id,
      user,
      token,
    });
    log("http", "info", "User logged in", { userId: user.id });
  } catch (error) {
    log("error", "error", "Login failed", { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json(false);
    }

    // Verify JWT token
    verifyJWT(token);

    res.json(true);
  } catch (error) {
    res.json(false);
  }
};

const logout = async (req, res) => {
  // Clear the token from the cookie
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: { model: Role, as: "role", attributes: ["name"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  publicRegister,
  adminRegister,
  login,
  loggedIn,
  logout,
  getCurrentUser,
};
