import { Op } from "sequelize";
import sequelize from "../utils/database.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { generateSKU, generateSlug } from "../utils/helpers.js";
import {
  handleValidationError,
  validateCreateProduct,
} from "../utils/validator.js";
import ProductVariant from "../models/productVariantModel.js";
import {
  NO_IMAGE_URL,
  PRODUCT_STATUS_VALUES,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_VALUES_ARRAY,
} from "../utils/constants.js";

// Get all Products
// GET /api/products/
// Public
const getAllProducts = async (req, res) => {
  try {
    let { page, limit, search, sort, status, isDeleted, minPrice, maxPrice } =
      req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const filterConditions = {};

    if (search) {
      filterConditions.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      if (PRODUCT_STATUS_VALUES_ARRAY.includes(status)) {
        filterConditions.status = status;
      } else {
        return res.status(400).json({
          success: false,
          message: `Invalid status value. Allowed values are: ${PRODUCT_STATUS_VALUES_ARRAY.join(
            ", "
          )}`,
          allowedValues: PRODUCT_STATUS_VALUES_ARRAY,
        });
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      const priceCondition = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        priceCondition[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        priceCondition[Op.lte] = parseFloat(maxPrice);
      }
      if (Object.keys(priceCondition).length > 0) {
        filterConditions.basePrice = priceCondition;
      }
    }

    const includeDeleted = isDeleted === true ? true : false;

    const [productsData, activeCount, inactiveCount, draftCount] =
      await Promise.all([
        Product.findAndCountAll({
          where: filterConditions,
          distinct: true,
          paranoid: includeDeleted,
          limit: limit,
          offset: offset,
          order: sort ? [PRODUCT_SORT_OPTIONS[sort.toUpperCase()]] : [],
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
        Product.count({
          where: { ...filterConditions, status: PRODUCT_STATUS_VALUES.DRAFT },
        }),
      ]);

    if (productsData.count === 0) {
      return res.status(200).json({ message: "No products found" });
    }

    return res.status(200).json({
      message:
        productsData.count === 0
          ? "No products found matching the criteria"
          : search
          ? `Found ${productsData.count} products matching "${search.trim()}"`
          : `Retrieved ${productsData.count} products`,
      data: productsData.rows,
      pagination: {
        limit: limit,
        offset: offset,
        totalPages: Math.ceil(productsData.count / limit),
        currentPage: page,
      },

      count: {
        totalProducts: productsData.count,
        activeProducts: activeCount,
        inactiveProducts: inactiveCount,
        draftCount: draftCount,
      },
      filters: {
        searchQuery: search || null,
        filters: filterConditions,
      },
    });
  } catch (err) {
    console.error(err);
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
      await t.rollback();
      return handleValidationError(error, res);
    }

    const {
      name,
      imgUrl,
      status,
      description,
      category,
      price,
      stock,
      slug,
      variants,
    } = value;

    // Validate category existence
    const categoryRecord = await Category.findOne({
      where: { name: category },
      transaction: t,
    });

    if (!categoryRecord) {
      t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // Check if product already exists with the same slug
    const generatedSlug = slug || generateSlug(name);
    const existingProduct = await Product.findOne({
      where: { slug: generatedSlug },
      transaction: t,
      paranoid: false, // Include soft-deleted products in the check
    });

    if (existingProduct) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: "Product Name or Slug already exist",
      });
    }

    // Create the product
    const product = await Product.create(
      {
        name: name.trim(),
        imgUrl: imgUrl ? imgUrl.trim() : NO_IMAGE_URL,
        status: status || PRODUCT_STATUS_VALUES.ACTIVE,
        description: description ? description.trim() : null,
        category: categoryRecord.name,
        slug: slug || generateSlug(name),
        categoryId: categoryRecord.id ? categoryRecord.id : null,
      },
      { transaction: t }
    );

    let variantsToCreate;

    if (Array.isArray(variants) && variants.length > 0) {
      // Case 1: User provided a variants array
      variantsToCreate = variants.map((variant, index) => ({
        productId: product.id,
        name: variant.name.trim(),
        price: parseFloat(variant.price),
        stock: parseInt(variant.stock),
        isDefault:
          variant.isDefault !== undefined ? variant.isDefault : index === 0,
        sku: generateSKU(product.name, variant.name),
        attributes: variant.attributes || {},
      }));
    } else {
      // Case 2: No variants array, create one default from top-level fields
      // This validation should ideally be in the schema validation logic
      if (!price || price <= 0 || stock === undefined || stock < 0) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Price and Stock are required for a default product.",
        });
      }
      variantsToCreate = [
        {
          productId: product.id,
          name: "Default",
          price: parseFloat(price),
          stock: parseInt(stock),
          isDefault: true,
          sku: generateSKU(product.name, "Default"),
          attributes: attributes || {},
        },
      ];
    }

    await ProductVariant.bulkCreate(variantsToCreate, { transaction: t });

    // Commit the transaction
    await t.commit();

    const createdProduct = await Product.findOne({
      where: { id: product.id },
      include: [
        { model: ProductVariant, as: "variants" },
        { model: Category, as: "category", attributes: ["name"] },
      ],
    });
    res
      .status(201)
      .json({ message: `product created successfully`, data: createdProduct });
  } catch (err) {
    await t.rollback();
    console.error("Error creating product:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
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
