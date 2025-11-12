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

const createRandomOrdersFor60Days = async () => {
  try {
    const users = await User.findAll();
    const products = await Product.findAll();

    if (users.length === 0 || products.length === 0) {
      console.log("❌ Not enough users or products to create orders.");
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
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Calculate previous month
    let previousMonth = currentMonth - 1;
    let previousYear = currentYear;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear = currentYear - 1;
    }

    console.log(
      `🚀 Creating orders for ${previousMonth}/${previousYear} and ${currentMonth}/${currentYear}`
    );

    // Generate orders for previous month
    await generateOrdersForMonth(
      previousYear,
      previousMonth,
      users,
      products,
      orderStatuses
    );

    // Generate orders for current month
    await generateOrdersForMonth(
      currentYear,
      currentMonth,
      users,
      products,
      orderStatuses
    );

    console.log(
      "🎉 Random orders created for 60 days (current month + previous month)."
    );
  } catch (error) {
    console.error("❌ Error creating orders:", error);
  }
};

const generateOrdersForMonth = async (
  year,
  month,
  users,
  products,
  orderStatuses
) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // month = 1-12

  console.log(`📅 Processing ${month}/${year} (${daysInMonth} days)`);

  for (let day = 1; day <= daysInMonth; day++) {
    // Generate random number of orders per day (1-5)
    const ordersToday = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < ordersToday; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const status =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      const productSubset = [];
      const numberOfProducts = Math.floor(Math.random() * 4) + 1;

      while (productSubset.length < numberOfProducts) {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];
        if (!productSubset.includes(randomProduct)) {
          productSubset.push(randomProduct);
        }
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const product of productSubset) {
        const quantity = Math.floor(Math.random() * 3) + 1;
        const itemTotal = product.price * quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity,
          price: product.price,
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

      // For shipped/delivered orders, add realistic timing
      let shippedAt = null;
      let deliveredAt = null;

      if (status === "shipped" || status === "delivered") {
        // Ship 1-3 days after order
        shippedAt = new Date(
          createdAt.getTime() +
            (Math.floor(Math.random() * 3) + 1) * 24 * 60 * 60 * 1000
        );
      }

      if (status === "delivered") {
        // Deliver 2-7 days after shipping
        deliveredAt = new Date(
          shippedAt.getTime() +
            (Math.floor(Math.random() * 6) + 2) * 24 * 60 * 60 * 1000
        );
      }

      const trackingNumber =
        status === "shipped" || status === "delivered"
          ? `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`
          : null;

      const order = await Order.create({
        id: uuidv4(),
        userId: user.id,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        shippingAddress: `Street ${Math.floor(
          Math.random() * 100
        )}, City ${day}`,
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
        `✅ Order ${order.id} (${status}) created for ${
          createdAt.toISOString().split("T")[0]
        } with ${orderItems.length} items.`
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
          "https://res.cloudinary.com/djfsxp9z0/image/upload/v1742571332/products/weed/6172705011f98cfbe6f5304a764fc862.png",
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

// User ↔ Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Product ↔ OrderItem
OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" });
Product.hasMany(OrderItem, { as: "orderItems", foreignKey: "productId" });

// Category has many Products
Category.hasMany(Product, {
  as: "products",
  foreignKey: "categoryId",
});

// Product belongs to Category
Product.belongsTo(Category, {
  as: "category",
  foreignKey: "categoryId",
});

// Product has many Variants
Product.hasMany(ProductVariant, {
  as: "variants",
  foreignKey: "productId",
});

// Variant belongs to Product
ProductVariant.belongsTo(Product, {
  as: "product",
  foreignKey: "productId",
});

const connectDb = async () => {
  console.log("Testing the database connection..");

  try {
    await sequelize.authenticate();
    console.log("🔗 Connection has been established successfully.");
    // await db.sync({ logging: true });
    // await sequelize.sync({ force: true, logging: true });
    await sequelize.sync({ force: false, logging: true });

    // await createRandomProducts();
    await createRoles();
    await createAdminUser();
    await createNormalUser();
    // await createModeratorUser();

    // await createRandomOrdersFor60Days();

    // await createCategories();
    await seedCategoriesAndProducts();
    console.log("☑️  All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.original);
  }
};

export default connectDb;
