import {
  BiCheckCircle,
  BiLoader,
  BiRotateLeft,
  BiInfoCircle,
} from "react-icons/bi";
import {
  MdOutlineLocalShipping,
  MdOutlineDateRange,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { HiArrowLongDown, HiArrowLongUp } from "react-icons/hi2";

const statusOptions = [
  {
    value: "all",
    label: "All",
    icon: <LuGalleryVerticalEnd />,
    className: "status-all",
  },
  {
    value: "completed",
    label: "Completed",
    icon: <BiCheckCircle />,
    className: "status-completed",
  },
  {
    value: "pending",
    label: "Pending",
    icon: <BiLoader />,
    className: "status-pending",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: <BiRotateLeft />,
    className: "status-cancelled",
  },
  {
    value: "refunded",
    label: "Refunded",
    icon: <BiInfoCircle />,
    className: "status-refunded",
  },
  {
    value: "shipped",
    label: "Shipped",
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
  },
  {
    value: "processing",
    label: "Processing",
    icon: <BiLoader />,
    className: "status-processing",
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
