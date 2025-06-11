export const APP_CONFIG = {
  DEFAULT_PAGE_LIMIT: 10,
  DEBOUNCE_DELAY: 500,
  ORDER_ID_DISPLAY_LENGTH: 8,
  //   MAX_RETRIES: 3,
};
export const API_ENDPOINTS = {
  ORDERS: "/api/orders",
  ORDER_DETAIL: (id) => `/api/orders/${id}`,
  ORDER_UPDATE: (id) => `/api/orders/${id}`,
  ORDER_CANCEL: (id) => `/api/orders/${id}/cancel`,
  ORDER_ITEMS: (orderId) => `/api/orders/${orderId}/items`,
  ORDER_TRACKING: (orderId) => `/api/orders/${orderId}/tracking`,
  ORDER_REFUND: (orderId) => `/api/orders/${orderId}/refund`,
  PRODUCTS: "/api/products",
  USERS: "/api/users",
  AUTH: "/api/auth",
};

// export const AUTH_ROUTES = {
//   LOGIN: "/login",
//   REGISTER: "/register",
//   FORGOT_PASSWORD: "/forgot-password",
// };
// export const USER_ROLES = {
//   ADMIN: "admin",
//   USER: "user",
//   GUEST: "guest",
// };
// export const NOTIFICATION_TYPES = {
//   SUCCESS: "success",
//   ERROR: "error",
//   INFO: "info",
//   WARNING: "warning",
// };
// export const DATE_FORMATS = {
//   ISO: "YYYY-MM-DDTHH:mm:ssZ",
//   DISPLAY: "MMM D, YYYY h:mm A",
//   SHORT: "MM/DD/YYYY",
// };
// export const HTTP_STATUS_CODES = {
//   OK: 200,
//   CREATED: 201,
//   NO_CONTENT: 204,
//   BAD_REQUEST: 400,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   NOT_FOUND: 404,
//   INTERNAL_SERVER_ERROR: 500,
// };
// export const ERROR_MESSAGES = {
//   NETWORK_ERROR: "Network error, please try again later.",
//   UNAUTHORIZED: "You are not authorized to perform this action.",
//   NOT_FOUND: "The requested resource was not found.",
//   SERVER_ERROR: "An unexpected error occurred on the server.",
//   VALIDATION_ERROR: "There were validation errors with your request.",
// };
// export const SUCCESS_MESSAGES = {
//   ORDER_CREATED: "Order created successfully.",
//   ORDER_UPDATED: "Order updated successfully.",
//   ORDER_DELETED: "Order deleted successfully.",
//   USER_REGISTERED: "User registered successfully.",
//   USER_LOGGED_IN: "User logged in successfully.",
// };
