import { log } from "../utils/logger.js";
import Role from "../models/roleModel.js";
import User from "../models/userModel.js";

const authRole = (accessRole) => async (req, res, next) => {
  try {
    const allowedRoles = Array.isArray(accessRole) ? accessRole : [accessRole];

    const user = await User.findByPk(req.user.id, {
      include: { model: Role, as: "role" },
    });

    if (!user || !allowedRoles.includes(user.role.name)) {
      log("error", "error", "Access denied", {
        message: "Access denied",
        status: 403,
      });

      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default authRole;
