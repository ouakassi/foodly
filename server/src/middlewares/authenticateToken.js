const jwt = require("jsonwebtoken");
const { verifyJWT } = require("../utils/auth");

// middleware function for authentication:
const authenticateToken = (req, res, next) => {
  try {
    // const authHeader = req.headers.authorization || req.headers.Authorization;

    // if (!authHeader?.startsWith("Bearer ")) {
    //   res.status(401).json({ message: "unauthorized" });
    //   return;
    // }
    // const [_, token] = authHeader.split(" ");
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }
    const verifiedUser = verifyJWT(token);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "not valid user" });
    return;
  }
};

module.exports = authenticateToken;
