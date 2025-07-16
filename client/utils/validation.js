import * as Yup from "yup";

const createProductValidationSchema = Yup.object({
  status: Yup.boolean().default(true),
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Name can only contain Latin letters."
    )
    .typeError("name must be a `string` type")
    .required("Name is required")
    .lowercase(),
  stock: Yup.number()
    .integer("Stock must be a whole number")
    .min(1, "must be at least 1")
    .typeError("must be a Number")
    .required("Stock is required"),
  price: Yup.number()
    .positive("must be a positive number")
    .min(1, "can't be less than 0")
    .typeError("must be a Number")
    .required("price is required"),
  discount: Yup.number()
    .min(0, "can't be less than 0%")
    .max(100, "can't be more than 100%")
    .typeError("must be a Number")
    .nullable(),
  category: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Name can only contain Latin letters."
    )
    .typeError("name must be a `string` type"),
  imgUrl: Yup.string().url("Must be a valid URL").nullable(),
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
