const { Op } = require("sequelize");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { httpLogger } = require("../utils/logger");

// Get all Products
// GET /api/products/
// Public
const getAllProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;

    const { search } = req.query;

    // Return all products if no pagination is provided
    if (!page && !limit) {
      if (!search) {
        const products = await Product.findAll();
        return res.status(200).json({ products });
      }
      const products = await Product.findAll({
        where: {
          name: { [Op.like]: `%${search}%` },
        },
      });
      return res
        .status(200)
        .json({
          products,
          message: "search results",
          searchQuery: search,
          searchCount: products.length,
        });
    }

    // Paginated
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const { count, rows: products } = await Product.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const productsCount = await Product.count();

    return res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      productsCount: parseInt(productsCount),
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
    const deletedProduct = await Product.findOne({ where: { id: productId } });

    if (!deletedProduct)
      return res.status(500).json({
        message: `product with id ${productId} not found or there is an error`,
      });

    await Product.destroy({
      where: { id: productId },
    });
    return res.status(200).json({
      message: `product with id ${productId} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
