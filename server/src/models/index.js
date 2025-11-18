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

const createRandomProducts = async () => {
  try {
    const productCount = await Product.count();
    if (productCount === 0) {
      console.log("No products found. Seeding database...");

      const randomProducts = Array.from({ length: 100 }).map(() => ({
        name: `Product ${Math.random().toString(36).substring(7)}`,
        imgUrl:
          "http://res.cloudinary.com/djfsxp9z0/image/upload/v1763120964/products/dddddddd/54e336f3c39a63234ee2d8f4ec507fd0.png", // Default placeholder image
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

const createRandomOrdersFor60Days = async () => {
  try {
    const users = await User.findAll();
    const variants = await ProductVariant.findAll({
      where: { isDeleted: false },
      include: ["product"],
    });

    if (users.length === 0 || variants.length === 0) {
      console.log("❌ Not enough users or variants to create orders.");
      return;
    }

    const orderStatuses = [
      "completed",
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "failed",
      "refunded",
    ];

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear = currentYear - 1;
    }

    console.log(`🚀 Creating random orders for: 
      → ${previousMonth}/${previousYear}
      → ${currentMonth}/${currentYear}`);

    await generateOrdersForMonth(
      previousYear,
      previousMonth,
      users,
      variants,
      orderStatuses
    );
    await generateOrdersForMonth(
      currentYear,
      currentMonth,
      users,
      variants,
      orderStatuses
    );

    console.log("🎉 Orders generated successfully for 60 days.");
  } catch (error) {
    console.error("❌ Error generating orders:", error);
  }
};

const generateOrdersForMonth = async (
  year,
  month,
  users,
  variants,
  orderStatuses
) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  console.log(
    `📅 Generating orders for ${month}/${year} (${daysInMonth} days)`
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const ordersToday = Math.floor(Math.random() * 6) + 1; // 1–6 orders per day

    for (let i = 0; i < ordersToday; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const status =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      // Pick 1–4 random variants
      const countVariants = Math.floor(Math.random() * 4) + 1;
      const pickedVariants = [];

      while (pickedVariants.length < countVariants) {
        const randomVariant =
          variants[Math.floor(Math.random() * variants.length)];

        if (!pickedVariants.includes(randomVariant)) {
          pickedVariants.push(randomVariant);
        }
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const variant of pickedVariants) {
        const qty = Math.floor(Math.random() * 3) + 1;
        const itemTotal = variant.price * qty;

        totalAmount += itemTotal;

        orderItems.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity: qty,
          price: variant.price,
        });
      }

      const randomHour = Math.floor(Math.random() * 24);
      const randomMinute = Math.floor(Math.random() * 60);

      const createdAt = new Date(
        year,
        month - 1,
        day,
        randomHour,
        randomMinute
      );

      // Shipping → delivered timing
      let shippedAt = null;
      let deliveredAt = null;

      if (status === "shipped" || status === "delivered") {
        shippedAt = new Date(
          createdAt.getTime() +
            (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000
        );
      }

      if (status === "delivered") {
        deliveredAt = new Date(
          shippedAt.getTime() +
            (Math.floor(Math.random() * 6) + 2) * 24 * 60 * 60 * 1000
        );
      }

      const trackingNumber =
        status === "shipped" || status === "delivered"
          ? `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`
          : null;

      // Create order
      const order = await Order.create({
        id: uuidv4(),
        userId: user.id,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: `Street ${Math.floor(Math.random() * 100)}, Test City`,
        status,
        paymentMethod: ["stripe", "paypal", "cash"][
          Math.floor(Math.random() * 3)
        ],
        trackingNumber,
        shippedAt,
        deliveredAt,
        createdAt,
        updatedAt: createdAt,
      });

      await Promise.all(
        orderItems.map((item) =>
          OrderItem.create({
            orderId: order.id,
            ...item,
          })
        )
      );

      console.log(
        `✔ Order ${order.id} (${status}) created on ${createdAt.toISOString()}`
      );
    }
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

    await createRandomOrdersFor60Days();

    // await createCategories();
    await seedCategoriesAndProducts();
    console.log("☑️  All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.original);
  }
};

export default connectDb;
