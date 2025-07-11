import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiCheckCircle,
  BiX,
} from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ORDER_STATUSES = {
  PENDING: {
    value: "pending",
    icon: <BiLoader />,
    label: "Pending",
    className: "status-pending",
    text: "Awaiting payment confirmation",
  },
  PROCESSING: {
    value: "processing",
    icon: <AiOutlineLoading3Quarters />,
    label: "Processing",
    className: "status-processing",
    text: "Processing order fulfillment",
  },
  SHIPPED: {
    value: "shipped",
    icon: <MdOutlineLocalShipping />,
    label: "Shipped",
    className: "status-shipped",
    text: "In transit to customer",
  },
  DELIVERED: {
    value: "delivered",
    icon: <FaBoxOpen />,
    label: "Delivered",
    className: "status-delivered",
    text: "Delivered to customer address",
  },
  COMPLETED: {
    value: "completed",
    icon: <BiCheckCircle />,
    label: "Completed",
    className: "status-completed",
    text: "Order fulfillment complete",
  },
  CANCELLED: {
    value: "cancelled",
    icon: <IoRemoveCircleOutline />,
    label: "Cancelled",
    className: "status-cancelled",
    text: "Order cancelled by customer/admin",
  },
  REFUNDED: {
    value: "refunded",
    icon: <BiRotateLeft />,
    label: "Refunded",
    className: "status-refunded",
    text: "Refund processed successfully",
  },
  FAILED: {
    value: "failed",
    icon: <BiX />,
    label: "Failed",
    className: "status-failed",
    text: "Payment processing failed",
  },
};

export { ORDER_STATUSES };
