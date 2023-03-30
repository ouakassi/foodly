const {
  hashPassword,
  createJWT,
  comparePasswords,
  verifyJWT,
} = require("../utils/auth");
const { validateRegister } = require("../utils/validator");

const User = require("../models/userModel");
const Role = require("../models/roleModel");

const roles = require("../utils/constants");

// register user
// POST /auth/register
// Public

const register = async (req, res) => {
  try {
    //pass register schema to check user inputs
    const { error, value } = validateRegister(req.body);

    // send error message if there is any errors in user request
    if (error) {
      const errors = [];
      error.details.map(({ message: errorMsg }) => {
        errors.push(errorMsg);
      });
      res.status(400).json({ error: errors });
      return;
    }

    // extract user data from the request body after validation
    const bodyData = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: await hashPassword(value.password),
      role: value.role || roles.USER,
    };

    // check if user exist in database
    const isUserExist = await User.findOne({
      where: { email: bodyData.email },
    });
    if (isUserExist) {
      res
        .status(400)
        .json({ message: `user with email: ${bodyData.email} already exist` });
      return;
    }

    // Check if the role exists
    const isRoleExist = await Role.findOne({ where: { name: bodyData.role } });
    console.log(isRoleExist.id);
    if (!isRoleExist) {
      return res.status(400).send({ message: "Invalid role" });
    }

    const { firstName, lastName, email, password } = bodyData;

    // add user to database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      roleId: isRoleExist.id,
    });
    // pass payload to generate a token
    const token = createJWT(user);
    // send token through cookie
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(201).json({ message: `user created successfully`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// login user
// POST /auth/login
// Public

const login = async (req, res) => {
  try {
    const bodyData = {
      email: req.body.email,
      password: req.body.password,
    };

    // find if user exist in database
    const user = await User.findOne({
      where: { email: bodyData.email },
    });

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    const isValidPassword = await comparePasswords(
      bodyData.password,
      user.password
    );
    if (!isValidPassword) {
      res.status(401).json({ message: "wrong password" });
      return;
    }
    const token = createJWT(user);

    // send token through cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    const { id } = user;
    res.status(200).json({ status: "logged in !", userId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      res.json(false);
      return;
    }
    verifyJWT(token);
    res.send(true);
  } catch (error) {
    res.json(false);
  }
};

const logout = async (req, res) => {
  // clear the token from the cookie
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .json({ message: "logout successfully" });
};

module.exports = {
  register,
  login,
  loggedIn,
  logout,
};
