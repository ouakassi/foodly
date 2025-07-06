import Role from "../models/roleModel.js";
import User from "../models/userModel.js";
import { ROLES } from "../utils/constants.js";

const getUserOverview = async (req, res) => {
  try {
    let adminRole = await Role.findOne({ where: { name: ROLES.ADMIN } });
    let userRole = await Role.findOne({ where: { name: ROLES.USER } });
    let moderatorRole = await Role.findOne({
      where: { name: ROLES.MODERATOR },
    });

    console.log(("adminRole", adminRole));

    const [usersCount, adminCount, customersCount, moderatorsCount] =
      await Promise.all([
        User.count(),
        User.count({ where: { roleId: adminRole.id } }),
        User.count({ where: { roleId: userRole.id } }),
        User.count({ where: { roleId: moderatorRole.id } }),
      ]);

    return res.status(200).json({
      message: "Users overview fetched successfully",
      data: {
        usersCount,
        adminCount,
        customersCount,
        moderatorsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user overview:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { getUserOverview };
