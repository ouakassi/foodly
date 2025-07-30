import * as Yup from "yup";

// Custom validation methods
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nameRegex =
  /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\-'&.,()0-9]+$/;
const categoryRegex = /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\-&]+$/;

const createProductValidationSchema = Yup.object({
  name: Yup.string()
    .matches(
      nameRegex,
      "Name contains invalid characters. Only letters, numbers, spaces, and common punctuation allowed"
    )
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters")
    .typeError("Name must be a string")
    .required("Product name is required")
    .transform((value) => value?.trim()),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .typeError("Description must be a string")
    .nullable()
    .transform((value) => value?.trim() || null),

  slug: Yup.string()
    .matches(
      slugRegex,
      'Slug must be lowercase with hyphens (e.g., "product-name")'
    )
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .typeError("Slug must be a string")
    .nullable(),

  // Category and status
  category: Yup.string()
    .matches(categoryRegex, "Category name contains invalid characters")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .typeError("Category must be a string")
    .required("Category is required")
    .transform((value) => value?.trim()),

  status: Yup.string()
    .oneOf(
      ["active", "inactive", "draft", "archived"],
      "Status must be one of: active, inactive, draft, archived"
    )
    .default("active"),

  // Images
  imgUrl: Yup.string()
    .url("Primary image must be a valid URL")
    .max(500, "Image URL cannot exceed 500 characters")
    .nullable(),

  images: Yup.array()
    .of(
      Yup.string()
        .url("Each image must be a valid URL")
        .max(500, "Image URL cannot exceed 500 characters")
    )
    .max(10, "Cannot have more than 10 product images")
    .nullable(),

  // Pricing and inventory (for products without variants)
  basePrice: Yup.number()
    .positive("Base price must be positive")
    .min(0.01, "Base price must be at least 0.01")
    .max(999999.99, "Base price cannot exceed 999,999.99")
    .typeError("Base price must be a number")
    .when("variants", {
      is: (variants) => !variants || variants.length === 0,
      then: (schema) =>
        schema.required("Base price is required when no variants are provided"),
      otherwise: (schema) => schema.nullable(),
    }),

  stock: Yup.number()
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(999999, "Stock cannot exceed 999,999")
    .typeError("Stock must be a number")
    .when("variants", {
      is: (variants) => !variants || variants.length === 0,
      then: (schema) =>
        schema.required("Stock is required when no variants are provided"),
      otherwise: (schema) => schema.nullable(),
    }),

  discount: Yup.number()
    .min(0, "Discount cannot be less than 0%")
    .max(100, "Discount cannot be more than 100%")
    .typeError("Discount must be a number")
    .nullable(),

  // Product specifications
  sku: Yup.string()
    .matches(
      /^[A-Za-z0-9\-_]+$/,
      "SKU can only contain letters, numbers, hyphens, and underscores"
    )
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU cannot exceed 50 characters")
    .nullable(),
});

const createUserValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  role: Yup.string()
    .required("Role is required")
    .oneOf(["admin", "user", "moderator"], "Invalid role selected"),
});

export { createProductValidationSchema, createUserValidationSchema };
