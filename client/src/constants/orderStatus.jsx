import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiCheckCircle,
} from "react-icons/bi";
import { MdOutlineLocalShipping } from "react-icons/md";

export const ORDER_STATUS = {
  COMPLETED: "completed",
  PENDING: "pending",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  PROCESSING: "processing",
  IN_PROGRESS: "In Progress",
  NOT_FULFILLED: "Not Fulfilled",
  NOT_APPLICABLE: "Not Applicable",
};

export const statusConfig = {
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
  [ORDER_STATUS.IN_PROGRESS]: {
    icon: <BiLoader />,
    className: "status-in-progress",
    text: "Order is in progress",
    color: "#06b6d4", // cyan
  },
  [ORDER_STATUS.NOT_FULFILLED]: {
    icon: <BiInfoCircle />,
    className: "status-not-fulfilled",
    text: "Order not yet fulfilled",
    color: "#6b7280", // gray
  },
  [ORDER_STATUS.NOT_APPLICABLE]: {
    icon: <BiInfoCircle />,
    className: "status-not-applicable",
    text: "No fulfillment required",
    color: "#6b7280", // gray
  },
};
