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

const ORDER_STATUS_VALUES_ARRAY = Object.values(ORDER_STATUSES);

module.exports = {
  ROLES,
  ORDER_STATUSES,
  ORDER_STATUS_VALUES_ARRAY,
};
