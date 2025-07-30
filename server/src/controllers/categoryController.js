import Category from "../models/categoryModel.js";
import { Op } from "sequelize";
import { generateSlug } from "../utils/model.js";

// Get all categories with optional filtering and pagination
const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "sortOrder",
      sortOrder = "ASC",
      withDeleted = false,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (search) {
      whereClause.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      paranoid: !withDeleted,
      // order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    if (page > totalPages && totalPages > 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        categories,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }
  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category found with ID: ${categoryId}`,
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  if (!slug) {
    return res.status(400).json({
      success: false,
      message: "Slug is required",
    });
  }
  try {
    const category = await Category.findOne({
      where: { slug },
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category found with Slug: ${slug}`,
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const finalSlug = slug || generateSlug(name);

    // Check if category with the same name OR slug already exists (case-insensitive)
    const existingCategory = await Category.findOne({
      where: {
        [Op.or]: [{ name }, { slug: finalSlug }],
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    const newCategory = await Category.create({
      name,
      slug: finalSlug,
      description,
    });

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, slug, description } = req.body;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category found with ID: ${categoryId}`,
      });
    }

    // Check if the new name or slug already exists
    const existingCategory = await Category.findOne({
      where: {
        [Op.or]: [{ name }, { slug: slug || generateSlug(name) }],
        id: { [Op.ne]: categoryId }, // Exclude current category
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or slug already exists",
      });
    }

    // Update the category
    await category.update({
      name,
      slug: slug || generateSlug(name),
      description,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Category ID is required",
    });
  }

  try {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category found with ID: ${categoryId}`,
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

const restoreCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByPk(categoryId, { paranoid: false });
    if (!category) return res.status(404).json({ message: "Not found" });

    await category.restore(); // restore the record
    res.json({ success: true, message: "Category restored" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  getAllCategories,
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  restoreCategory,
};
