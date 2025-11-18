import Joi from "joi";
import {
  ORDER_STATUS_VALUES_ARRAY,
  ORDER_SORT_KEYS,
  ROLES_VALUES_ARRAY,
  PRODUCT_STATUS_VALUES_ARRAY,
  PRODUCT_STATUS_VALUES,
} from "./constants.js";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const namePattern =
  /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\-'&.,()0-9]+$/;
const categoryPattern =
  /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\-&]+$/;
const skuPattern = /^[A-Za-z0-9\-_]+$/;
const tagPattern = /^[A-Za-z0-9\s\-_]+$/;

// validator function to wrap the schema and to check all body fields
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

// SCHEMAS

// ── Auth Schemas ──

const adminRegisterSchema = Joi.object({
  firstName: Joi.string().alphanum().max(20),
  lastName: Joi.string().alphanum().max(20),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  confirmPassword: Joi.ref("password"),
  role: Joi.string()
    .valid(...ROLES_VALUES_ARRAY)
    .optional(),
});

const registerSchema = Joi.object({
  firstName: Joi.string().alphanum().max(20),
  lastName: Joi.string().alphanum().max(20),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  confirmPassword: Joi.ref("password"),
  role: Joi.forbidden(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

// ── Orders Query Schema ──
const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  search: Joi.string().allow(""),
  sort: Joi.valid(...ORDER_SORT_KEYS),
  status: Joi.string().valid(...ORDER_STATUS_VALUES_ARRAY),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

// ── Product Schema ── //

const productVariantSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Variant name is required",
    "string.min": "Variant name must be at least 1 character",
    "string.max": "Variant name cannot exceed 100 characters",
    "any.required": "Variant name is required",
  }),
  sku: Joi.string().pattern(skuPattern).min(3).max(50).required().messages({
    "string.base": "SKU must be a string",
    "string.pattern.base":
      "SKU can only contain letters, numbers, dashes (-), or underscores (_)",
    "string.min": "SKU must be at least 3 characters",
    "string.max": "SKU cannot exceed 50 characters",
    "any.required": "SKU is required for each variant",
  }),
  price: Joi.number()
    .positive()
    .min(0.01)
    .max(999999.99)
    .precision(2)
    .required()
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Variant price must be positive",
      "any.required": "Variant price is required",
    }),
  stock: Joi.number().integer().min(0).max(999999).required().messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
    "number.max": "Stock cannot exceed 999,999",
    "any.required": "Variant stock is required",
  }),
  attributes: Joi.object()
    .pattern(
      Joi.string()
        .regex(/^[a-zA-Z0-9_-]{1,50}$/) // keys: letters, numbers, dash, underscore
        .message(
          "Attribute keys must be 1-50 characters (letters, numbers, - or _)"
        ),
      Joi.alternatives().try(
        Joi.string().max(100).messages({
          "string.max": "Attribute values cannot exceed 100 characters",
        }),
        Joi.number()
      )
    )
    .default({})
    .messages({
      "object.base": "Attributes must be an object",
      "object.pattern.match": "Invalid attribute key or value format",
    }),
}).unknown(true);

const createProductSchema = Joi.object({
  // Basic product information
  name: Joi.string()
    .pattern(namePattern)
    .min(2)
    .max(200)
    .required()
    .trim()
    .messages({
      "string.pattern.base":
        "Name contains invalid characters. Only letters, numbers, spaces, and common punctuation allowed",
      "string.min": "Product name must be at least 2 characters",
      "string.max": "Product name cannot exceed 200 characters",
      "any.required": "Product name is required",
    }),

  description: Joi.string().min(10).max(2000).allow(null, "").trim().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description cannot exceed 2000 characters",
  }),

  slug: Joi.string().pattern(slugPattern).min(2).max(100).allow(null).messages({
    "string.pattern.base":
      'Slug must be lowercase with hyphens (e.g., "product-name")',
    "string.min": "Slug must be at least 2 characters",
    "string.max": "Slug cannot exceed 100 characters",
  }),

  // Category and status
  category: Joi.string()
    .pattern(categoryPattern)
    .min(2)
    .max(100)
    .required()
    .trim()
    .messages({
      "string.pattern.base": "Category name contains invalid characters",
      "string.min": "Category name must be at least 2 characters",
      "string.max": "Category name cannot exceed 100 characters",
      "any.required": "Category is required",
    }),

  status: Joi.string()
    .valid(...PRODUCT_STATUS_VALUES_ARRAY)
    .default(PRODUCT_STATUS_VALUES.ACTIVE)
    .messages({
      "any.only": `Status must be one of: ${PRODUCT_STATUS_VALUES_ARRAY.join(
        ", "
      )}`,
    }),

  // Images
  imgUrl: Joi.string().uri().max(500).allow(null, "").messages({
    "string.uri": "Primary image must be a valid URL",
    "string.max": "Image URL cannot exceed 500 characters",
  }),
  variants: Joi.array()
    .items(productVariantSchema)
    .min(1)
    .max(50)
    .allow(null)
    .messages({
      "array.max": "You cannot add more than 50 variants per product",
    }),
}).unknown(true);

// The update schema makes those same fields optional
const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(), // <-- Optional
  category: Joi.string().min(2).max(100).optional(), // <-- Optional
  description: Joi.string().min(10).max(2000).allow(null, "").optional(),
  slug: Joi.string().pattern(slugPattern).min(2).max(100).optional(),
  status: Joi.string()
    .valid(...PRODUCT_STATUS_VALUES_ARRAY)
    .optional(),
  imgUrl: Joi.string().uri().max(500).allow(null, "").optional(),

  // For updates, variant handling is complex, but the array itself is optional
  variants: Joi.array()
    .items(productVariantSchema) // You'd need a separate schema for updating variants
    .optional(),
}).unknown(true);

// ── Validator Function ──
const analyticsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  // status: Joi.string()
  //   .valid(...ORDER_STATUS_VALUES_ARRAY)
  //   .optional(),
});

// Error Handler
function handleValidationError(error, res) {
  const errors = error.details.map(({ message: errorMsg }) => errorMsg);
  return res.status(400).json({ message: "Validation Failed", error: errors });
}

// Exported validated functions

const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { status: 400, message: "Start date and end date are required." };
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  const now = new Date().toISOString();

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    return { status: 400, message: "Invalid date format." };
  }

  if (parsedEndDate > now) {
    return { status: 400, message: "End date cannot be in the future." };
  }

  if (parsedStartDate > parsedEndDate) {
    return { status: 400, message: "Start date cannot be after end date." };
  }

  // No errors
  return null;
};

const validateAdminRegister = validator(adminRegisterSchema);
const validateRegister = validator(registerSchema);
const validateLogin = validator(loginSchema);
const validateOrderQuery = validator(orderQuerySchema);
const validateAnalytics = validator(analyticsSchema);
const validateCreateProduct = validator(createProductSchema);
const validateUpdateProduct = validator(updateProductSchema);
export {
  validateAdminRegister,
  validateRegister,
  validateLogin,
  handleValidationError,
  validateOrderQuery,
  validateAnalytics,
  validateDateRange,
  validateCreateProduct,
  validateUpdateProduct,
};
