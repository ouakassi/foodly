const {
  hashPassword,
  createJWT,
  comparePasswords,
  verifyJWT,
} = require("../utils/auth");
const {
  validateRegister,
  validateLogin,
  handleValidationError,
} = require("../utils/validator");

const User = require("../models/userModel");
const Role = require("../models/roleModel");

const roles = require("../utils/constants");

// register user
// POST /auth/register
// Public

const register = async (req, res) => {
  try {
    // Validate user inputs
    const { error, value } = validateRegister(req.body);

    // Return error message if user input is invalid
    if (error) {
      return handleValidationError(error, res);
    }

    // Extract user data from request body after validation
    const { firstName, lastName, email, password } = value;
    const hashedPassword = await hashPassword(password);
    const role = value.role || roles.USER;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exists` });
    }

    // Check if the role exists
    const existingRole = await Role.findOne({ where: { name: role } });
    if (!existingRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Create new user in the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: existingRole.id,
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
    const user = await User.findOne({ where: { email } });

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
    res
      .status(200)
      .json({ message: "Logged in successfully!", userId: user.id });
  } catch (error) {
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

module.exports = {
  register,
  login,
  loggedIn,
  logout,
};
