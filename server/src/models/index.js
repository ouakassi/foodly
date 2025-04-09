const User = require("./userModel");
const Role = require("./roleModel");
const Address = require("./addressModel");
const db = require("../utils/database");
const roles = require("../utils/constants");
const Product = require("./productModel");
const Inventory = require("./inventoryModel");

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

const crateRandomProducts = async () => {
  try {
    const productCount = await Product.count();
    if (productCount === 0) {
      console.log("No products found. Seeding database...");

      const randomProducts = Array.from({ length: 16 }).map(() => ({
        name: `Product ${Math.random().toString(36).substring(7)}`,
        imgUrl: "https://via.placeholder.com/150", // Default placeholder image
        price: (Math.random() * 100).toFixed(2),
        stock: Math.floor(Math.random() * 50) + 1,
        discount: Math.floor(Math.random() * 30), // Random discount between 0-30%
        category: ["Electronics", "Clothing", "Books", "Furniture"][
          Math.floor(Math.random() * 4)
        ],
        status: Math.random() > 0.5, // Random true/false
      }));

      await Product.bulkCreate(randomProducts);
      console.log("10 Random Products Inserted!");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// relations

Role.hasMany(User);
User.belongsTo(Role);

User.hasMany(Address);
Address.belongsTo(User);

Product.hasOne(Inventory);
Inventory.belongsTo(Product);

const connectDb = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    // await db.sync({ logging: true });
    await db.sync({ force: true, logging: true });
    await crateRandomProducts();
    await createRoles();
    await createCategories();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

module.exports = connectDb;
