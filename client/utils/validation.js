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

export { createProductValidationSchema };
