const User = require("./userModel");
const Role = require("./roleModel");
const Address = require("./addressModel");
const db = require("../utils/database");
const roles = require("../utils/constants");
const Product = require("./productModel");
const Inventory = require("./inventoryModel");
const Category = require("./categoryModel");

//insert roles to database
const createRoles = async () => {
  try {
    const tableCount = await Role.count();
    if (tableCount > 0) {
      console.log("Roles already exists");
      return;
    }
    await Role.bulkCreate([
      { name: roles.ADMIN },
      { name: roles.MODERATOR },
      { name: roles.USER },
    ]);
    console.log("Roles inserted successfully");
  } catch (error) {
    console.error("Error inserting roles", error);
  }
};

const createCategories = async () => {
  try {
    const tableCount = await Category.count();
    if (tableCount > 0) {
      console.log("Categories already exists");
      return;
    }
    await Category.bulkCreate([
      { name: "nuts" },
      { name: "coffee" },
      { name: "oils" },
      { name: "herbs" },
    ]);
    console.log("Categories inserted successfully");
  } catch (error) {
    console.error("Error inserting Categories", error);
  }
};

// relations

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Address);
Address.belongsTo(User);

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasOne(Inventory);
Inventory.belongsTo(Product);

const connectDb = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    // await db.sync({ logging: true });
    await db.sync({ force: true, logging: true });
    await createRoles();
    await createCategories();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

module.exports = connectDb;
