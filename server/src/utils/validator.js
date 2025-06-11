import Joi from "joi";
import {
  ORDER_STATUS_VALUES_ARRAY,
  ORDER_SORT_KEYS,
  ROLES_VALUES_ARRAY,
} from "./constants.js";

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
});

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
const validateAdminRegister = validator(adminRegisterSchema);
const validateRegister = validator(registerSchema);
const validateLogin = validator(loginSchema);
const validateOrderQuery = validator(orderQuerySchema);
const validateAnalytics = validator(analyticsSchema);

const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { status: 400, message: "Start date and end date are required." };
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    return { status: 400, message: "Invalid date format." };
  }

  if (parsedStartDate > parsedEndDate) {
    return { status: 400, message: "Start date cannot be after end date." };
  }

  // No errors
  return null;
};

export {
  validateAdminRegister,
  validateRegister,
  validateLogin,
  handleValidationError,
  validateOrderQuery,
  validateAnalytics,
  validateDateRange,
};
