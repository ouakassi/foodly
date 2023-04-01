const authRole = (accessRole) => (req, res, next) => {
  try {
    const userRole = req.cookies.token;
    console.log(userRole);
    if (!userRole) {
      return res.status(404).json({ message: "User not authenticated" });
    }
    if (userRole !== accessRole) {
      return res.status(401).json({ message: "Not allowed" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = authRole;
