const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

const ORDER_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",
  FAILED: "failed",
  EXPIRED: "expired",
};

const ORDER_SORT_OPTIONS = {
  CREATEDAT_ASC: ["createdAt", "ASC"],
  CREATEDAT_DESC: ["createdAt", "DESC"],
  UPDATEDAT_ASC: ["updatedAt", "ASC"],
  UPDATEDAT_DESC: ["updatedAt", "DESC"],
  TOTALAMOUNT_ASC: ["totalAmount", "ASC"],
  TOTALAMOUNT_DESC: ["totalAmount", "DESC"],
};

const PRODUCT_SORT_OPTIONS = {
  PRICE_ASC: ["basePrice", "ASC"],
  PRICE_DESC: ["basePrice", "DESC"],
  NAME_ASC: ["name", "ASC"],
  NAME_DESC: ["name", "DESC"],
  STOCK_ASC: ["stock", "ASC"],
  STOCK_DESC: ["stock", "DESC"],
  CATEGORY_ASC: ["category", "ASC"],
  CATEGORY_DESC: ["category", "DESC"],
  CREATEDAT_ASC: ["createdAt", "ASC"],
  CREATEDAT_DESC: ["createdAt", "DESC"],
  UPDATEDAT_ASC: ["updatedAt", "ASC"],
  UPDATEDAT_DESC: ["updatedAt", "DESC"],
};

const PRODUCT_STATUS_VALUES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
  ARCHIVED: "archived",
  OUT_OF_STOCK: "out_of_stock",
};

const NO_IMAGE_URL = "https://example.com/no-image.png";

// transform
const ROLES_VALUES_ARRAY = Object.values(ROLES);
const PRODUCT_STATUS_VALUES_ARRAY = Object.values(PRODUCT_STATUS_VALUES);
const ORDER_STATUS_VALUES_ARRAY = Object.values(ORDER_STATUSES);
const ORDER_SORT_KEYS = Object.keys(ORDER_SORT_OPTIONS);

export {
  ROLES,
  ROLES_VALUES_ARRAY,
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
  ORDER_SORT_OPTIONS,
  ORDER_SORT_KEYS,
  PRODUCT_STATUS_VALUES,
  PRODUCT_STATUS_VALUES_ARRAY,
  NO_IMAGE_URL,
  PRODUCT_SORT_OPTIONS,
};
