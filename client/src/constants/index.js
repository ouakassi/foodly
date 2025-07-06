import {
  BsGrid,
  BsGridFill,
  BsBasket,
  BsBasketFill,
  BsClipboardCheck,
  BsClipboardCheckFill,
  BsClipboardData,
  BsClipboardDataFill,
  BsBarChart,
  BsBarChartFill,
  BsGear,
  BsGearFill,
  BsQuestionCircle,
  BsQuestionCircleFill,
  BsBoxArrowRight,
  BsPeople,
  BsPeopleFill,
  BsPersonCircle,
} from "react-icons/bs";

export const APP_CONFIG = {
  DEFAULT_PAGE_LIMIT: 10,
  DEBOUNCE_DELAY: 500,
  ORDER_ID_DISPLAY_LENGTH: 8,
  ORDERS_OVERVIEW_DATES: {
    startDate: "2023-01-01",
    endDate: "2023-12-31",
  },
  //   MAX_RETRIES: 3,
};
export const API_ENDPOINTS = {
  //Products
  PRODUCTS: "/api/products",
  PRODUCT_DETAIL: (id) => `/api/products/${id}`,
  PRODUCT_CREATE: "/api/products/",
  PRODUCT_UPDATE: (id) => `/api/products/${id}`,
  PRODUCT_DELETE: (id) => `/api/products/${id}/delete`,

  // Orders
  ORDERS: "/api/orders",
  ORDERS_OVERVIEW: "/api/orders/overview",
  ORDER_DETAIL: (id) => `/api/orders/${id}`,
  ORDER_UPDATE: (id) => `/api/orders/${id}`,
  ORDER_CANCEL: (id) => `/api/orders/${id}/cancel`,
  ORDER_ITEMS: (orderId) => `/api/orders/${orderId}/items`,
  ORDER_TRACKING: (orderId) => `/api/orders/${orderId}/tracking`,
  ORDER_REFUND: (orderId) => `/api/orders/${orderId}/refund`,

  // Users
  USERS: "/api/users",
  USERS_OVERVIEW: "/api/users/overview",
  USER_DETAIL: (id) => `/api/users/${id}`,

  // Auth
  AUTH: "/api/auth",

  // Analytics - Totals
  ANALYTICS_TOTAL_ORDERS: "/api/analytics/total-orders", // params: { month, year }
  ANALYTICS_TOTAL_ORDERS_BY_STATUS: (status) =>
    `/api/analytics/total-orders/${status}`,
  ANALYTICS_TOTAL_SALES_BY_DATE: "/api/analytics/total-sales", // params: { startDate, endDate }

  // Analytics - Sales
  ANALYTICS_SALES_BY_PRODUCT: (productId) =>
    `/api/analytics/sales/${productId}`, // params: { startDate, endDate }
  ANALYTICS_SALES_BY_CATEGORY: (categoryId) =>
    `/api/analytics/sales/category/${categoryId}`, // params: { startDate, endDate }
  ANALYTICS_SALES_BY_PAYMENT_METHOD: "/api/analytics/sales/payment-method", // params: { startDate, endDate }
  ANALYTICS_SALES_BY_REGION: "/api/analytics/sales/region", // params: { startDate, endDate }

  // Analytics - Rankings
  ANALYTICS_TOP_PRODUCTS: "/api/analytics/top-products", // params: { month, year }
  ANALYTICS_TOP_CATEGORIES: "/api/analytics/top-categories", // params: { month, year }
  ANALYTICS_TOP_CUSTOMERS: "/api/analytics/top-customers", // params: { month, year }

  // Analytics - Daily Trends
  ANALYTICS_DAILY_ORDERS_PER_MONTH: "/api/analytics/daily-orders", // params: { month, year }
};

export const LINKS_WITH_ICONS = {
  dashboard: {
    icon: BsGrid,
    filledIcon: BsGridFill,
    label: "Overview",
    path: "/overview",
  },
  overview: {
    icon: BsGrid,
    filledIcon: BsGridFill,
    label: "Overview",
    path: "/overview",
  },
  products: {
    icon: BsBasket,
    filledIcon: BsBasketFill,
    label: "Products",
    path: "/products",
  },
  orders: {
    icon: BsClipboardCheck,
    filledIcon: BsClipboardCheckFill,
    label: "Orders",
    path: "/orders",
  },
  users: {
    icon: BsPeople,
    filledIcon: BsPeopleFill,
    label: "Users",
    path: "/users",
  },
  reports: {
    icon: BsClipboardData,
    filledIcon: BsClipboardDataFill,
    label: "Reports",
    path: "/reports",
  },
  analytics: {
    icon: BsBarChart,
    filledIcon: BsBarChartFill,
    label: "Analytics",
    path: "/analytics",
  },
  settings: {
    icon: BsGear,
    filledIcon: BsGearFill,
    label: "Settings",
    path: "/settings",
  },
  help: {
    icon: BsQuestionCircle,
    filledIcon: BsQuestionCircleFill,
    label: "Help",
    path: "/help",
  },
  logout: {
    icon: BsBoxArrowRight,
    label: "Logout",
    path: "/logout",
  },
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
