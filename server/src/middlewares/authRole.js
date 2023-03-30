const authRole = (accessRole) => {
  return (req, res, next) => {
    if (req.user.role !== accessRole) {
      res.status(401).json({ message: "not allowed" });
      return;
    }
    next();
  };
};

module.exports = authRole;
