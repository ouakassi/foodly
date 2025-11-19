import User from "./userModel.js";
import Role from "./roleModel.js";
import OrderItem from "./orderItemModel.js";
import Order from "./orderModel.js";
import Product from "./productModel.js";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../utils/database.js";
import { ORDER_STATUS_VALUES_ARRAY, ROLES } from "../utils/constants.js";
import { hashPassword } from "../utils/auth.js";
import Category from "./categoryModel.js";
import ProductVariant from "./productVariantModel.js";
import { generateSKU, generateSlug } from "../utils/helpers.js";
// import Inventory from './inventoryModel';

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

// I create a small helper to generate random integers
const randomInt = (min, max) => {
  // I want a random number in a range, inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// I use this to generate random words (just for testing)
const randomWord = () => {
  const words = ["Premium", "Organic", "Deluxe", "Natural", "Classic", "Fresh"];
  return words[randomInt(0, words.length - 1)];
};

// I use this to generate SKU-like strings
const randomSKU = () => `SKU-${uuidv4().slice(0, 8).toUpperCase()}`;

// -----------------------------------------------
// MAIN SEED FUNCTION
// -----------------------------------------------
export const seedProductsWithVariants = async (count = 10) => {
  // I create an array to store all products with their variants
  const seededProducts = [];

  for (let i = 0; i < count; i++) {
    // I create a fake product name
    const productName = `${randomWord()} Product ${i + 1}`;

    // I create the product first
    const product = await Product.create({
      id: uuidv4(),
      name: productName,
      basePrice: randomInt(50, 500),
      stock: 0, // I will update stock after generating variants
      category: "General",
    });

    // I decide how many variants this product will have
    const variantsCount = randomInt(1, 5);

    let totalStock = 0;
    const variants = [];

    for (let j = 0; j < variantsCount; j++) {
      // I create variant price by adding a small difference
      const priceModifier = randomInt(-20, 20);

      const variantStock = randomInt(5, 50);
      totalStock += variantStock;

      // I create the variant
      const variant = await Variant.create({
        id: uuidv4(),
        productId: product.id,
        name: `${productName} - Variant ${j + 1}`,
        price: product.basePrice + priceModifier,
        sku: randomSKU(),
        stock: variantStock,
        isDefault: j === 0, // I make the first variant default
      });

      variants.push(variant);
    }

    // I update product stock based on all variant stock summed together
    await product.update({ stock: totalStock });

    // I push final result so orders can use it later
    seededProducts.push({
      product,
      variants,
    });
  }

  return seededProducts;
};

const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const PAYMENT_METHODS = ["Credit Card", "PayPal", "Cash on Delivery"];

/**
 * Seed function to create sample orders with random data
 * @param {number} numberOfOrders - Number of orders to create (default: 10)
 */
export const seedOrders = async (numberOfOrders = 10) => {
  try {
    console.log("🌱 Starting order seeding...");

    // Fetch all users, products, and variants from the database
    const users = await User.findAll();
    const products = await Product.findAll();
    const variants = await ProductVariant.findAll({
      include: [{ model: Product, as: "product" }],
    });

    if (users.length === 0 || variants.length === 0) {
      throw new Error("Please seed users and products first!");
    }

    const createdOrders = [];

    for (let i = 0; i < numberOfOrders; i++) {
      await sequelize.transaction(async (t) => {
        // Pick a random user
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Pick 1-5 random items for the order
        const numberOfItems = Math.floor(Math.random() * 5) + 1;
        const selectedVariants = [];
        const orderItems = [];

        // Select random variants ensuring no duplicates
        for (let j = 0; j < numberOfItems; j++) {
          let variant;
          do {
            variant = variants[Math.floor(Math.random() * variants.length)];
          } while (selectedVariants.includes(variant.id));

          selectedVariants.push(variant.id);

          // Random quantity between 1-5, but not more than available stock
          const maxQuantity = Math.min(variant.stock, 5);
          const quantity = Math.floor(Math.random() * maxQuantity) + 1;

          orderItems.push({
            variant,
            quantity,
            price: variant.price,
          });
        }

        // Calculate total amount
        const totalAmount = orderItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        // Generate random shipping address
        const shippingAddress = generateRandomAddress();

        // Pick random payment method
        const paymentMethod =
          PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)];

        // Pick random order status
        const statusKeys = Object.keys(ORDER_STATUSES);
        const randomStatus =
          ORDER_STATUSES[
            statusKeys[Math.floor(Math.random() * statusKeys.length)]
          ];

        // Create the order
        const order = await Order.create(
          {
            userId: randomUser.id,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            status: randomStatus,
            shippingAddress,
            paymentMethod,
            createdAt: generateRandomDate(),
          },
          { transaction: t }
        );

        // Create order items and update variant stock
        for (const item of orderItems) {
          await OrderItem.create(
            {
              orderId: order.id,
              productId: item.variant.productId,
              variantId: item.variant.id,
              quantity: item.quantity,
              price: item.price,
            },
            { transaction: t }
          );

          // Update variant stock
          item.variant.stock -= item.quantity;
          await item.variant.save({ transaction: t });
        }

        createdOrders.push(order);
        console.log(
          `✅ Order #${order.id} created for ${randomUser.email} (${
            orderItems.length
          } items, $${totalAmount.toFixed(2)})`
        );
      });
    }

    console.log(`\n🎉 Successfully seeded ${createdOrders.length} orders!`);
    return createdOrders;
  } catch (error) {
    console.error("❌ Order seeding failed:", error);
    throw error;
  }
};

const createAdminUser = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: ROLES.ADMIN } });

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

const createNormalUser = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: ROLES.USER } });

    if (!adminRole) {
      console.log("Admin role not found. Please seed roles first.");
      return;
    }

    const existingUser = await User.findOne({
      where: { email: "ouakassi@gmail.com" },
    });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    await User.create({
      firstName: "oussama",
      lastName: "ouakassi",
      email: "ouakassi@gmail.com",
      isActive: false,
      password: await hashPassword("ouss@@00"),
      roleId: adminRole.id,
    });

    console.log("✅ Admin user created");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

const createModeratorUser = async () => {
  try {
    const adminRole = await Role.findOne({ where: { name: ROLES.MODERATOR } });

    if (!adminRole) {
      console.log("Admin role not found. Please seed roles first.");
      return;
    }

    const existingUser = await User.findOne({
      where: { email: "salim@gmail.com" },
    });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    await User.create({
      firstName: "oussama",
      lastName: "ouakassi",
      email: "salim@gmail.com",
      password: await hashPassword("ouss@@00"),
      roleId: adminRole.id,
    });

    console.log("✅ Admin user created");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

const seedCategoriesAndProducts = async (req, res) => {
  try {
    // 1) Create categories
    const categoryNames = ["Herbs", "Oils", "Spices", "Supplements"];
    const categories = [];
    for (const name of categoryNames) {
      let category = await Category.findOne({ where: { name } });
      if (!category) {
        category = await Category.create({
          name,
          slug: generateSlug(name),
          description: `All about ${name}`,
        });
      }
      categories.push(category);
    }

    // 2) Create products
    const sampleProductNames = [
      "Rosemary",
      "Chamomile",
      "Peppermint",
      "Basil",
      "Thyme",
      "Olive Oil",
      "Almond Oil",
      "Argan Oil",
      "Sesame Oil",
      "Coconut Oil",
      "Turmeric Powder",
      "Paprika",
      "Black Pepper",
      "Cumin",
      "Cinnamon",
      "Multivitamin",
      "Vitamin C",
      "Omega 3",
      "Probiotic",
      "Magnesium",
    ];

    const statuses = ["draft", "active", "inactive"];

    for (let i = 0; i < 20; i++) {
      const name = sampleProductNames[i];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      const product = await Product.create({
        name,
        slug: generateSlug(name),
        description: `This is a sample description for ${name}.`,
        imgUrl:
          "https://res.cloudinary.com/djfsxp9z0/image/upload/v1763120953/products/Oils/54e336f3c39a63234ee2d8f4ec507fd0.png",
        status: statuses[Math.floor(Math.random() * statuses.length)],
        categoryId: randomCategory.id,
      });

      // 3) Create two example variants for each product
      const variants = [
        {
          name: "100g",
          price: 9.99,
          stock: 50,
          sku: generateSKU(name, "100g"),
          attributes: { weight: "100g" },
        },
        {
          name: "1kg",
          price: 49.99,
          stock: 30,
          sku: generateSKU(name, "1kg"),
          attributes: { weight: "1kg" },
        },
      ];

      await ProductVariant.bulkCreate(
        variants.map((v) => ({
          ...v,
          productId: product.id,
        }))
      );
    }

    return res.json({
      success: true,
      message: "Seeded categories, products, and variants",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Relations

// Role ↔ User
User.belongsTo(Role, { foreignKey: "roleId", as: "role" });
Role.hasMany(User, { foreignKey: "roleId" });

// User ↔ Address
// User.hasMany(Address, { foreignKey: "userId" });
// Address.belongsTo(User, { foreignKey: "userId" });

// ==========================
// User ↔ Order
// ==========================
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// ==========================
// Order ↔ OrderItem
// ==========================
Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// ==========================
// Product ↔ OrderItem
// ==========================
// A product can appear in many order items
Product.hasMany(OrderItem, { as: "orderItems", foreignKey: "productId" });

// An order item references a product
OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

// ==========================
// Variant ↔ OrderItem   (🔥 REQUIRED FIX)
// ==========================
// A variant can appear in many order items
ProductVariant.hasMany(OrderItem, {
  as: "orderItems",
  foreignKey: "variantId",
});

// An order item may reference a variant
OrderItem.belongsTo(ProductVariant, { as: "variant", foreignKey: "variantId" });

// ==========================
// Category ↔ Product
// ==========================
Category.hasMany(Product, { as: "products", foreignKey: "categoryId" });
Product.belongsTo(Category, { as: "category", foreignKey: "categoryId" });

// ==========================
// Product ↔ Variant
// ==========================
Product.hasMany(ProductVariant, { as: "variants", foreignKey: "productId" });
ProductVariant.belongsTo(Product, { as: "product", foreignKey: "productId" });

const connectDb = async () => {
  console.log("Testing the database connection..");

  try {
    await sequelize.authenticate();
    console.log("🔗 Connection has been established successfully.");
    // await db.sync({ logging: true });
    await sequelize.sync({ force: true, logging: true });
    // await sequelize.sync({ force: false, logging: true });

    // await createRandomProducts();
    await createRoles();
    await createAdminUser();
    await createNormalUser();
    await createModeratorUser();

    (async () => {
      // const products = await seedProductsWithVariants(15);
      await seedOrders();

      console.log("Seeding finished successfully!");
    })();

    // await createCategories();
    await seedCategoriesAndProducts();
    console.log("☑️  All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.original);
  }
};

export default connectDb;
