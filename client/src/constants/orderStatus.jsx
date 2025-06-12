import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiCheckCircle,
} from "react-icons/bi";
import { MdOutlineLocalShipping } from "react-icons/md";

const ORDER_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  PROCESSING: "processing",
  RETURNED: "returned",
  EXPIRED: "expired",
  DEFAULT: "default",
};

const statusConfig = {
  [ORDER_STATUS.COMPLETED]: {
    icon: <BiCheckCircle />,
    className: "status-completed",
    text: "Order completed successfully",
    color: "#10b981", // green
  },
  [ORDER_STATUS.PENDING]: {
    icon: <BiLoader />,
    className: "status-pending",
    text: "Awaiting confirmation or payment",
    color: "#f59e0b", // amber
  },
  [ORDER_STATUS.CANCELLED]: {
    icon: <BiRotateLeft />,
    className: "status-cancelled",
    text: "Order was cancelled",
    color: "#ef4444", // red
  },
  [ORDER_STATUS.REFUNDED]: {
    icon: <BiInfoCircle />,
    className: "status-refunded",
    text: "Customer refunded",
    color: "#8b5cf6", // purple
  },
  [ORDER_STATUS.SHIPPED]: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Shipped to customer",
    color: "#3b82f6", // blue
  },
  [ORDER_STATUS.DELIVERED]: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Delivered to customer",
    color: "#10b981", // green
  },
  [ORDER_STATUS.PROCESSING]: {
    icon: <BiLoader />,
    className: "status-processing",
    text: "Order is being processed",
    color: "#f59e0b", // amber
  },
  [ORDER_STATUS.RETURNED]: {
    icon: <BiInfoCircle />,
    className: "status-returned",
    text: "Order was returned",
    color: "#ef4444", // red (for returned status)
  },
  [ORDER_STATUS.EXPIRED]: {
    icon: <BiInfoCircle />,
    className: "status-expired",
    text: "Order expired",
    color: "#6b7280", // gray
  },
  [ORDER_STATUS.DEFAULT]: {
    icon: <BiInfoCircle />,
    className: "status-not-applicable",
    text: "No fulfillment required",
    color: "#6b7280", // gray
  },
};

export default statusConfig;
