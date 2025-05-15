const User = require("./userModel");
const Role = require("./roleModel");
const OrderItem = require("./orderItemModal");
const Order = require("./orderModel");
const Address = require("./addressModel");
const Product = require("./productModel");

const db = require("../utils/database");
const { ROLES } = require("../utils/constants");
const { hashPassword } = require("../utils/auth");
// const Inventory = require("./inventoryModel");

//insert roles to database
const createRoles = async () => {
  try {
    const tableCount = await Role.count();
    if (tableCount > 0) {
      console.log("Roles already exists");
      return;
    }
    await Role.bulkCreate([
      { name: ROLES.ADMIN },
      { name: ROLES.MODERATOR },
      { name: ROLES.USER },
    ]);
    console.log("✅ Roles inserted successfully");
  } catch (error) {
    console.error("Error inserting roles", error);
  }
};

const createRandomProducts = async () => {
  try {
    const productCount = await Product.count();
    if (productCount === 0) {
      console.log("No products found. Seeding database...");

      const randomProducts = Array.from({ length: 100 }).map(() => ({
        name: `Product ${Math.random().toString(36).substring(7)}`,
        imgUrl:
          "https://res.cloudinary.com/djfsxp9z0/image/upload/v1742571332/products/weed/6172705011f98cfbe6f5304a764fc862.png", // Default placeholder image
        price: (Math.random() * 100).toFixed(2),
        stock: Math.floor(Math.random() * 50) + 1,
        discount: Math.floor(Math.random() * 30), // Random discount between 0-30%
        category: ["Electronics", "Clothing", "Books", "Furniture"][
          Math.floor(Math.random() * 4)
        ],
        status: Math.random() > 0.5, // Random true/false
      }));

      await Product.bulkCreate(randomProducts);
      console.log("✅ 10 Random Products Inserted!");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

const createAdminUser = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: "admin" } });

    if (!adminRole) {
      console.log("Admin role not found. Please seed roles first.");
      return;
    }

    const existingUser = await User.findOne({
      where: { email: "lmoutchoo@gmail.com" },
    });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    await User.create({
      firstName: "oussama",
      lastName: "ouakassi",
      email: "lmoutchoo@gmail.com",
      password: await hashPassword("ouss@@00"),
      roleId: adminRole.id,
    });

    console.log("✅ Admin user created");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

// Relations

// Role ↔ User
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId" });

// User ↔ Address
// User.hasMany(Address, { foreignKey: "userId" });
// Address.belongsTo(User, { foreignKey: "userId" });

// User ↔ Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Product ↔ Inventory
// Product.hasOne(Inventory, { foreignKey: "productId", as: "inventory" });
// Inventory.belongsTo(Product, { foreignKey: "productId" });

// (Optional) Order ↔ Address (if using an address table for shipping address)
// Order.belongsTo(Address, {
//   foreignKey: "shippingAddressId",
//   as: "shippingAddress",
// });

// (Optional) Category ↔ Product
// Category.hasMany(Product, { foreignKey: "categoryId" });
// Product.belongsTo(Category, { foreignKey: "categoryId" });

// (Optional) User ↔ Review ↔ Product (if implementing reviews later)
// User.hasMany(Review, { foreignKey: "userId" });
// Review.belongsTo(User, { foreignKey: "userId" });

// Product.hasMany(Review, { foreignKey: "productId" });
// Review.belongsTo(Product, { foreignKey: "productId" });

// (Optional) Order ↔ Payment
// Order.hasOne(Payment, { foreignKey: "orderId", as: "payment" });
// Payment.belongsTo(Order, { foreignKey: "orderId" });

const connectDb = async () => {
  console.log("Testing the database connection..");
  console.log(ROLES.ADMIN);
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    // await db.sync({ logging: true });
    await db.sync({ force: true, logging: true });
    await createRandomProducts();
    await createRoles();
    await createAdminUser();
    await createCategories();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

module.exports = connectDb;
