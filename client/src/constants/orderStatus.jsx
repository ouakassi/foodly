import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiCheckCircle,
} from "react-icons/bi";
import { MdOutlineLocalShipping } from "react-icons/md";

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

const STATUS_CONFIG = {
  [ORDER_STATUSES.COMPLETED]: {
    icon: <BiCheckCircle />,
    className: "status-completed",
    text: "Order completed successfully",
    color: "#10b981", // green
  },
  [ORDER_STATUSES.PENDING]: {
    icon: <BiLoader />,
    className: "status-pending",
    text: "Awaiting confirmation or payment",
    color: "#f59e0b", // amber
  },
  [ORDER_STATUSES.CANCELLED]: {
    icon: <BiRotateLeft />,
    className: "status-cancelled",
    text: "Order was cancelled",
    color: "#ef4444", // red
  },
  [ORDER_STATUSES.REFUNDED]: {
    icon: <BiInfoCircle />,
    className: "status-refunded",
    text: "Customer refunded",
    color: "#8b5cf6", // purple
  },
  [ORDER_STATUSES.SHIPPED]: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Shipped to customer",
    color: "#3b82f6", // blue
  },
  [ORDER_STATUSES.DELIVERED]: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Delivered to customer",
    color: "#10b981", // green
  },
  [ORDER_STATUSES.PROCESSING]: {
    icon: <BiLoader />,
    className: "status-processing",
    text: "Order is being processed",
    color: "#f59e0b", // amber
  },
  [ORDER_STATUSES.RETURNED]: {
    icon: <BiInfoCircle />,
    className: "status-returned",
    text: "Order was returned",
    color: "#ef4444", // red (for returned status)
  },
  [ORDER_STATUSES.EXPIRED]: {
    icon: <BiInfoCircle />,
    className: "status-expired",
    text: "Order expired",
    color: "#6b7280", // gray
  },
  [ORDER_STATUSES.DEFAULT]: {
    icon: <BiInfoCircle />,
    className: "status-not-applicable",
    text: "No fulfillment required",
    color: "#6b7280", // gray
  },
};

export { STATUS_CONFIG, ORDER_STATUSES };
