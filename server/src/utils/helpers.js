import { randomUUID } from "crypto"; // Required in Node.js

const getPreviousDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - duration);

  return { prevStart, prevEnd };
};

const generateSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const generateSKU = (productName, variantName) => {
  const productCode = productName.substring(0, 3).toUpperCase();
  const variantCode = variantName.substring(0, 3).toUpperCase();

  // Generate a full UUID and take the first 8 characters for a random component.
  const uniqueId = randomUUID().substring(0, 8).toUpperCase();

  return `${productCode}-${variantCode}-${uniqueId}`;
};

export { getPreviousDateRange, generateSlug, generateSKU };
