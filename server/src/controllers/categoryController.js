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

export {
  getAllCategories,
  createCategory,
  // getCategoryById,
  // getCategoryBySlug,
  // getCategoryTree,
  // getCategoryPath,
  // updateCategory,
  // deleteCategory,
  // reorderCategories,
};
