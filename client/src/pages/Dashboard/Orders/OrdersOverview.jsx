import "./OrdersOverview.css";
import AnalyticCard from "../../../components/Dashboard/AnalyticCard";
import { PiBasketFill } from "react-icons/pi";
import { MdOutlineAttachMoney } from "react-icons/md";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import {
  formatCurrency,
  formatDateToYMD,
  getCurrentMonthYear,
  getMonthRange,
} from "../../../lib/helpers";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { API_URL } from "../../../api/api";
import { API_ENDPOINTS } from "../../../constants";
import { ORDER_STATUSES } from "../../../constants/orderStatus";

export default function OrdersOverview() {
  const { year, month } = getCurrentMonthYear();

  const { firstDay, lastDay } = getMonthRange(year, month);

  const OverviewStartDate = formatDateToYMD(firstDay);
  const OverviewEndDate = formatDateToYMD(new Date());

  const { data, isLoading, error } = useAxiosFetch(
    API_URL + API_ENDPOINTS.ORDERS_OVERVIEW,
    {
      startDate: OverviewStartDate,
      endDate: OverviewEndDate,
      // endDate: "2025-07-31",
    }
  );

  const {
    totalOrders,
    totalOrdersPrevious,
    orderGrowth,
    totalRevenue,
    totalRevenuePrevious,
    revenueGrowth,
    averageOrderValue,
    averageOrderValuePrevious,
    avgOrderGrowth,
    ordersByStatus = {}, // fallback to empty object to avoid undefined errors
  } = data || {};

  const {
    pending = 0,
    cancelled = 0,
    completed = 0,
    shipped = 0,
    delivered = 0,
  } = ordersByStatus;

  console.log(ordersByStatus);

  const loadingSpinner = (
    <LoadingSpinner
      style={{ height: "1.2rem", width: "1.2rem", borderWidth: "2px" }}
    />
  );

  const orderOverviewData = [
    {
      icon: <PiBasketFill />,
      label: "Total Orders",
      value: isLoading ? loadingSpinner : totalOrders?.toLocaleString() || "0",
      trend: orderGrowth?.toFixed(2) ?? "0.00",

      // description: `compared last month (${totalOrdersPrevious || 0})`,
      description: "compared last month",
      className: "total-orders",
    },
    {
      icon: <MdOutlineAttachMoney />,
      label: "Total Revenue",
      value: isLoading ? loadingSpinner : formatCurrency(totalRevenue, "USD"),
      trend: revenueGrowth?.toFixed(2),

      description: "compared last month",
      className: "total-revenue",
    },
    {
      icon: ORDER_STATUSES.PENDING?.icon,
      label: "Orders in Progress",
      value: isLoading ? loadingSpinner : pending?.toLocaleString() || "0",
      // trend: "+8",

      description: "In This Month",

      className: "orders-progress",
    },
    {
      icon: ORDER_STATUSES.COMPLETED?.icon,
      label: "Completed Orders",
      value: isLoading ? loadingSpinner : completed?.toLocaleString() || "0",
      // trend: "-5",

      description: "In This Month",
      className: "orders-cancelled",
    },

    // {
    //   icon: "🕒",
    //   label: "Pending Orders",
    //   value: "89",
    //   trend: "+2",

    //   description: "since yesterday",
    // },
  ];

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load order overview data. Please try again.</p>
      </div>
    );
  }

  return (
    data &&
    orderOverviewData.map(
      ({ icon, label, value, trend, description, className }, index) => (
        <AnalyticCard
          key={index}
          icon={icon}
          label={label}
          value={value}
          trend={trend}
          description={description}
          className={className}
        />
      )
    )
  );
}
