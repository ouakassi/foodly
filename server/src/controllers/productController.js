import { Op } from "sequelize";
import sequelize from "../utils/database.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { generateSlug } from "../utils/helpers.js";
import {
  handleValidationError,
  validateCreateProduct,
} from "../utils/validator.js";
import ProductVariant from "../models/productVariantModel.js";
import { NO_IMAGE_URL, PRODUCT_STATUS_VALUES } from "../utils/constants.js";

// Get all Products
// GET /api/products/
// Public
const getAllProducts = async (req, res) => {
  try {
    let { page, limit, search, sort, status, isDeleted } = req.query;

    const sortOptions = {
      price_asc: ["price", "ASC"],
      price_desc: ["price", "DESC"],
      name_asc: ["name", "ASC"],
      name_desc: ["name", "DESC"],
      stock_asc: ["stock", "ASC"],
      stock_desc: ["stock", "DESC"],
      discount_asc: ["discount", "ASC"],
      discount_desc: ["discount", "DESC"],
      category_asc: ["category", "ASC"],
      category_desc: ["category", "DESC"],
      createdAt_asc: ["createdAt", "ASC"],
      createdAt_desc: ["createdAt", "DESC"],
      updatedAt_asc: ["updatedAt", "ASC"],
      updatedAt_desc: ["updatedAt", "DESC"],
    };

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterConditions = {};

    if (search) {
      filterConditions.name = { [Op.like]: `%${search}%` };
    }

    if (status === "active") {
      filterConditions.status = true;
    } else if (status === "inactive") {
      filterConditions.status = false;
    }

    const [productsData, activeCount, inactiveCount, withDeletedCount] =
      await Promise.all([
        Product.findAndCountAll({
          where: filterConditions,
          distinct: true,
          paranoid: isDeleted && isDeleted,
          limit: limit,
          offset: Number.isNaN(parseInt(page))
            ? 0
            : (parseInt(page) - 1) * limit,
          order: sort ? [sortOptions[sort]] : [],
          include: [
            { model: ProductVariant, as: "variants" },
            { model: Category, as: "category" },
          ],
        }),
        Product.count({
          where: { ...filterConditions, status: PRODUCT_STATUS_VALUES.ACTIVE },
        }),
        Product.count({
          where: {
            ...filterConditions,
            status: PRODUCT_STATUS_VALUES.INACTIVE,
          },
        }),

        Product.count({ where: { ...filterConditions }, paranoid: false }),
      ]);

    if (productsData.count === 0 && status === undefined) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({
      productsData: productsData.rows,
      totalPages: Math.ceil(productsData.count / limit),
      currentPage: page,
      totalProducts: status ? activeCount + inactiveCount : productsData.count,
      activeProducts: activeCount,
      inactiveProducts: inactiveCount,
      totalProductsWithDeleted: withDeletedCount,
      message: search ? "Search results" : "All products",
      searchQuery: search || null,
      filters: filterConditions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one Product
// GET /api/products/:id
// Public
const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res
        .status(404)
        .json({ message: `product with id ${productId} not found ` });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// create Product
// POST /api/products/
// Public
const createProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { error, value } = validateCreateProduct(req.body);

    if (error) {
      return handleValidationError(error, res);
    }

    const {
      name,
      imgUrl,
      basePrice,
      status,
      description,
      category,
      stock,
      slug,
      variants,
    } = value;

    // Validate category existence
    const categoryRecord = await Category.findOne({
      where: { name: category },
    });

    if (!categoryRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check if product already exists with the same slug
    const existingProduct = await Product.findOne({
      where: { slug: slug || generateSlug(name) },
    });
    if (existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product Name or Slug already exist",
      });
    }
    const hasVariants = Array.isArray(variants) && variants.length > 0;

    if (!hasVariants) {
      if (!basePrice || basePrice <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Product base price is required and must be greater than 0 when no variants are provided",
        });
      }

      if (stock === undefined || stock < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Product stock is required and cannot be negative when no variants are provided",
        });
      }
    }

    // Create the product
    const product = await Product.create({
      name: name.trim(),
      imgUrl: imgUrl ? imgUrl.trim() : NO_IMAGE_URL,
      basePrice: hasVariants ? null : parseFloat(basePrice),
      stock: hasVariants ? null : parseInt(stock),
      status: status || PRODUCT_STATUS_VALUES.ACTIVE,
      description: description ? description.trim() : null,
      category: categoryRecord.name,
      slug: slug || generateSlug(name),
      categoryId: categoryRecord.id ? categoryRecord.id : null,
    });

    if (hasVariants) {
      const productVariants = variants.map((variant) => ({
        ...variant,
        productId: product.id,
      }));
      await ProductVariant.bulkCreate(productVariants, { transaction: t });
    }

    // 4️⃣ Commit if everything passed
    await t.commit();

    const createdProduct = await Product.findOne({
      where: { id: product.id },
      include: [
        { model: ProductVariant, as: "variants" },
        { model: Category, as: "category" },
      ],
    });
    res
      .status(201)
      .json({ message: `product created successfully`, data: createdProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update Product
// PUT /api/products/:id
// Public
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const updatedProduct = await Product.findOne({ where: { id: productId } });

    if (!updatedProduct) {
      return res.status(404).json({ message: "product not found" });
    } else {
      await Product.update(productData, {
        where: { id: productId },
      });

      return res
        .status(200)
        .json({ message: `product with id ${productId} updated successfully` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete Product
// DELETE /api/products/:id
// Public
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Use unscoped query to find even deleted products (optional)
    const product = await Product.scope(null).findOne({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: `Product with id ${productId} not found.`,
      });
    }

    if (product.isDeleted) {
      return res.status(400).json({
        message: `Product with id ${productId} is already deleted.`,
      });
    }

    await product.update({ isDeleted: true });

    return res.status(200).json({
      message: `Product with id ${productId} deleted successfully.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
