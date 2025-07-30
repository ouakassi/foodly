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
  createdAt_asc: ["createdAt", "ASC"],
  createdAt_desc: ["createdAt", "DESC"],
  updatedAt_asc: ["updatedAt", "ASC"],
  updatedAt_desc: ["updatedAt", "DESC"],
  totalAmount_asc: ["totalAmount", "ASC"],
  totalAmount_desc: ["totalAmount", "DESC"],
};

const PRODUCT_STATUS_VALUES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
  ARCHIVED: "archived",
  OUT_OF_STOCK: "out_of_stock",
};

const PRODUCT_STATUS_VALUES_ARRAY = [
  "active",
  "inactive",
  "draft",
  "archived",
  "out_of_stock",
];

const NO_IMAGE_URL = "https://example.com/no-image.png"; // Placeholder for no image

// transform
const ROLES_VALUES_ARRAY = Object.values(ROLES);
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
};
