import * as Yup from "yup";

// Custom validation methods
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nameRegex =
  /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s\-'&.,()0-9]+$/;
const categoryRegex = /^[A-Za-z0-9\s\-]+$/;

const createProductValidationSchema = Yup.object({
  // ————————————————— Static product fields —————————————————
  name: Yup.string()
    .matches(
      nameRegex,
      "Name contains invalid characters. Only letters, numbers, spaces, and common punctuation allowed"
    )
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters")
    .typeError("Name must be a string")
    .required("Product name is required")
    .transform((v) => v?.trim()),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .typeError("Description must be a string")
    .nullable()
    .transform((v) => v?.trim() || null),

  // (Optional) slug if you still want it — else remove this block
  slug: Yup.string()
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase with hyphens (e.g., "product-name")'
    )
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .typeError("Slug must be a string")
    .nullable(),

  category: Yup.string()
    .matches(categoryRegex, "Category name contains invalid characters")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .typeError("Category must be a string")
    .required("Category is required"),
  status: Yup.string()
    .oneOf(
      ["active", "inactive", "draft", "archived"],
      "Status must be one of: active, inactive, draft, archived"
    )
    .default("draft")
    .required(),

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

  // ————————————————— Variants array —————————————————
  variants: Yup.array()
    .of(
      Yup.object({
        name: Yup.string()
          .matches(nameRegex, "Variant name contains invalid characters")
          .min(1, "Variant name is required")
          .max(100, "Variant name cannot exceed 100 characters")
          .required("Variant name is required")
          .transform((v) => v?.trim()),

        sku: Yup.string()
          .matches(
            /^[A-Za-z0-9\-_]+$/,
            "SKU can only contain letters, numbers, hyphens, and underscores"
          )
          .min(1, "SKU is required")
          .max(50, "SKU cannot exceed 50 characters")
          .required("SKU is required")
          .transform((v) => v?.trim()),

        price: Yup.number()
          .typeError("Price must be a number")
          .min(0, "Price cannot be negative")
          .required("Price is required"),

        stock: Yup.number()
          .typeError("Stock must be a number")
          .integer("Stock must be a whole number")
          .min(0, "Stock cannot be negative")
          .required("Stock is required"),

        attributes: Yup.object({
          size: Yup.string()
            .nullable()
            .transform((v) => v?.trim() || null),
          color: Yup.string()
            .nullable()
            .transform((v) => v?.trim() || null),
        }).nullable(),
      })
    )
    .min(1, "At least one variant is required")
    .required("Variants are required"),
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

const createCategoryValidationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters")
    .matches(nameRegex, "Category name contains invalid characters"),

  slug: Yup.string()
    .notRequired()
    .nullable()
    .typeError("Category slug must be a string")
    // .min(0, "Category slug must be at least 2 characters")
    .max(100, "Category slug cannot exceed 100 characters")
    .matches(slugRegex, "Category slug must be lowercase with hyphens"),

  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable(),
});

export {
  createProductValidationSchema,
  createUserValidationSchema,
  createCategoryValidationSchema,
};
