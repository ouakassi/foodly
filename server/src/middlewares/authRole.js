const Role = require("../models/roleModel");
const User = require("../models/userModel");

const authRole = (accessRole) => async (req, res, next) => {
  try {
    const allowedRoles = Array.isArray(accessRole) ? accessRole : [accessRole];

    const user = await User.findByPk(req.user.id, {
      include: { model: Role, as: "role" },
    });

    if (!user || !allowedRoles.includes(user.role.name)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = authRole;
