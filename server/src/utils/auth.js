import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// hash the given password using bcrypt
const hashPassword = (password) => {
  const SALT = 5;
  return bcrypt.hash(password, SALT);
};

// compare the user password with the hashed one in database
const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// function to signing tokens
const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
  return token;
};

// function to verify tokens
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { hashPassword, comparePasswords, createJWT, verifyJWT };
