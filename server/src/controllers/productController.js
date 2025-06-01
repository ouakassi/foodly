import { Op } from "sequelize";
import Product from "../models/productModel.js";

// Get all Products
// GET /api/products/
// Public
const getAllProducts = async (req, res) => {
  try {
    let { page, limit, search, sort, status } = req.query;

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

    const filterConditions = { isDeleted: false };

    if (search) {
      filterConditions.name = { [Op.like]: `%${search}%` };
    }

    if (status === "active") {
      filterConditions.status = true;
    } else if (status === "inactive") {
      filterConditions.status = false;
    }

    const [productsData, activeCount, inactiveCount] = await Promise.all([
      Product.findAndCountAll({
        where: filterConditions,
        limit: limit,
        offset: Number.isNaN(parseInt(page)) ? 0 : (parseInt(page) - 1) * limit,
        order: sort ? [sortOptions[sort]] : [],
      }),
      Product.count({
        where: { ...filterConditions, status: true },
      }),
      Product.count({
        where: { ...filterConditions, status: false },
      }),
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
  try {
    const { name, imgUrl, price, category, stock, status, discount } = req.body;

    // const productCategory = await Category.findOne({
    //   where: { name: category },
    // });

    // if (!category) {
    //   return res.status(404).json({ message: "category not found" });
    // }

    const product = await Product.create({
      status,
      name,
      imgUrl,
      price,
      stock,
      discount,
      category,
    });

    res
      .status(201)
      .json({ message: `product created successfully`, data: product });
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
