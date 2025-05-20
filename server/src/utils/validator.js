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

// Error Handler
function handleValidationError(error, res) {
  const errors = error.details.map(({ message: errorMsg }) => errorMsg);
  return res.status(400).json({ error: errors });
}

// Exported validated functions
const validateAdminRegister = validator(adminRegisterSchema);
const validateRegister = validator(registerSchema);
const validateLogin = validator(loginSchema);
const validateOrderQuery = validator(orderQuerySchema);

export {
  validateAdminRegister,
  validateRegister,
  validateLogin,
  handleValidationError,
  validateOrderQuery,
};
