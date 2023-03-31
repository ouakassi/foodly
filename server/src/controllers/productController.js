const Product = require("../models/productModel");
const { httpLogger } = require("../utils/logger");

// Get all Products
// GET /api/products/
// Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { status: "active" } });
    if (products.length === 0) {
      return res.status(404).json({ message: "no products found" });
    } else {
      res.status(200).json(products);
    }
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
    const bodyData = {
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      price: req.body.price,
      isSale: req.body.isSale,
      desc: req.body.desc,
    };

    const product = await Product.create(bodyData);

    res
      .status(201)
      .json({ message: `product created successfully`, date: product });
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
