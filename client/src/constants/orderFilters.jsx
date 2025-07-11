import { MdOutlineDateRange, MdOutlineAttachMoney } from "react-icons/md";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { HiArrowLongDown, HiArrowLongUp } from "react-icons/hi2";
import { ORDER_STATUSES } from "./orderStatus";

const statusOptions = [
  {
    value: "all",
    label: "All",
    icon: <LuGalleryVerticalEnd />,
    className: "status-all",
  },
  {
    value: ORDER_STATUSES.PENDING.value,
    label: ORDER_STATUSES.PENDING.label,
    icon: ORDER_STATUSES.PENDING.icon,
    className: "status-pending",
  },
  {
    value: ORDER_STATUSES.PROCESSING.value,
    label: ORDER_STATUSES.PROCESSING.label,
    icon: ORDER_STATUSES.PROCESSING.icon,
    className: "status-processing",
  },
  {
    value: ORDER_STATUSES.SHIPPED.value,
    label: ORDER_STATUSES.SHIPPED.label,
    icon: ORDER_STATUSES.SHIPPED.icon,
    className: "status-shipped",
  },
  {
    value: ORDER_STATUSES.DELIVERED.value,
    label: ORDER_STATUSES.DELIVERED.label,
    icon: ORDER_STATUSES.DELIVERED.icon,
    className: "status-delivered",
  },
  {
    value: ORDER_STATUSES.COMPLETED.value,
    label: ORDER_STATUSES.COMPLETED.label,
    icon: ORDER_STATUSES.COMPLETED.icon,
    className: "status-completed",
  },
  {
    value: ORDER_STATUSES.CANCELLED.value,
    label: ORDER_STATUSES.CANCELLED.label,
    icon: ORDER_STATUSES.CANCELLED.icon,
    className: "status-cancelled",
  },
  {
    value: ORDER_STATUSES.REFUNDED.value,
    label: ORDER_STATUSES.REFUNDED.label,
    icon: ORDER_STATUSES.REFUNDED.icon,
    className: "status-refunded",
  },
  {
    value: ORDER_STATUSES.FAILED.value,
    label: ORDER_STATUSES.FAILED.label,
    icon: ORDER_STATUSES.FAILED.icon,
    className: "status-failed",
  },
];

const SORT_FIELDS = {
  CREATED_AT: "createdAt",
  TOTAL_AMOUNT: "totalAmount",
  STATUS: "status",
  USER_EMAIL: "user.email",
};

const SORT_DIRECTIONS = {
  ASC: "asc",
  DESC: "desc",
};

const sortOptions = [
  {
    value: `${SORT_FIELDS.CREATED_AT}_${SORT_DIRECTIONS.DESC}`,
    label: "Created At (Newest)",
    icon: (
      <>
        <HiArrowLongDown />
        <MdOutlineDateRange />
      </>
    ),
    className: "bg-red-100",
  },
  {
    value: `${SORT_FIELDS.CREATED_AT}_${SORT_DIRECTIONS.ASC}`,
    label: "Created At (Oldest)",
    icon: (
      <>
        <HiArrowLongUp />
        <MdOutlineDateRange />
      </>
    ),
    className: "bg-yellow-100",
  },
  {
    value: `${SORT_FIELDS.TOTAL_AMOUNT}_${SORT_DIRECTIONS.ASC}`,
    label: "Total Amount (Low to High)",
    icon: (
      <>
        <HiArrowLongUp />
        <MdOutlineAttachMoney />
      </>
    ),
    className: "bg-green-100",
  },
  {
    value: `${SORT_FIELDS.TOTAL_AMOUNT}_${SORT_DIRECTIONS.DESC}`,
    label: "Total Amount (High to Low)",
    icon: (
      <>
        <HiArrowLongDown />
        <MdOutlineAttachMoney />
      </>
    ),
    className: "bg-blue-100",
  },
];

export { sortOptions, statusOptions };
