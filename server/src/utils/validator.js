const Joi = require("joi");

// validator function to wrap the schema and to check all body fields
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

//schemas

const registerSchema = Joi.object({
  firstName: Joi.string().alphanum().max(20),
  lastName: Joi.string().alphanum().max(20),
  email: Joi.string().email().required(),
  role: Joi.string(),
  password: Joi.string().min(6).max(20).required(),
  confirmPassword: Joi.ref("password"),
  // accessToken: Joi.string().token(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
});

const validateRegister = validator(registerSchema);
const validateLogin = validator(loginSchema);

module.exports = {
  validateRegister,
  validateLogin,
};
