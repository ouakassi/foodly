import "./OrdersPage.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { LiaSortAmountDownAltSolid } from "react-icons/lia";
import { Skeleton } from "@/components/ui/skeleton";

import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiCheckCircle,
  BiCross,
} from "react-icons/bi";
import { HiArrowLongDown, HiArrowLongUp } from "react-icons/hi2";

import {
  MdCropSquare,
  MdEditDocument,
  MdOutlineAttachMoney,
  MdOutlineDateRange,
  MdOutlineErrorOutline,
  MdOutlineLocalShipping,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { PiBasketFill } from "react-icons/pi";

import { HiDotsVertical, HiSwitchVertical } from "react-icons/hi";
import { Check, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/api/api";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RiFilterFill,
  RiMoneyDollarCircleFill,
  RiProgress1Line,
} from "react-icons/ri";
import { FaCcStripe, FaPaypal } from "react-icons/fa";

import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { NextBtn, PreviousBtn } from "../../../components/Table/TableBtns";
import {
  formatCurrency,
  formatDate,
  formatDateToYMD,
  getCurrentMonthYear,
  getMonthRange,
} from "../../../lib/helpers";
import CustomButton from "../../../components/Buttons/CustomButton";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import DialogEditOrderDetails from "./dialogs/DialogEditOrderDetails";
import DialogShowOrderDetails from "./dialogs/DialogShowOrderDetails";
import { sortOptions, statusOptions } from "../../../constants/orderFilters";
import { STATUS_CONFIG, ORDER_STATUSES } from "../../../constants/orderStatus";
import { API_ENDPOINTS, APP_CONFIG } from "../../../constants/index";

import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";

export default function OrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("none");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || APP_CONFIG.DEFAULT_PAGE_LIMIT;
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "";
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const debouncedSearch = useDebounce(search, APP_CONFIG.DEBOUNCE_DELAY);

  const todayYMD = formatDateToYMD(new Date());

  // console.log(getCurrentMonthYear());
  const { year, month } = getCurrentMonthYear();
  const { firstDay, lastDay } = getMonthRange(year, month);
  const OverviewStartDate = formatDateToYMD(firstDay);
  const OverviewEndDate = formatDateToYMD(new Date());

  const params = {
    ...(search && { search: debouncedSearch }),
    limit,
    page,
    ...(status !== "all" && { status }),
    ...(sort && { sort }),

    startDate: startDate,
    // endDate: endDate || todayYMD,
    endDate: endDate,
  };

  const {
    data: ordersData,
    isLoading,
    error,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.ORDERS, params);
  console.log(ordersData);
  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    error: orderError,
  } = useAxiosFetch(
    selectedOrderId
      ? API_URL + API_ENDPOINTS.ORDER_DETAIL(selectedOrderId)
      : null
  );

  const {
    data: analyticsTotalSalesData,
    isLoading: isAnalyticsTotalSalesLoading,
    error: analyticsTotalSalesError,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.ANALYTICS_TOTAL_SALES_BY_DATE, {
    startDate: OverviewStartDate,
    endDate: OverviewEndDate,
  });

  const {
    data: analyticsTotalOrdersData,
    isLoading: isAnalyticsTotalOrdersLoading,
    error: analyticsTotalOrdersError,
  } = useAxiosFetch(API_URL + API_ENDPOINTS.ANALYTICS_TOTAL_ORDERS, {
    startDate: OverviewStartDate,
    endDate: OverviewEndDate,
  });

  const {
    data: analyticsTotalOrdersByPendingData,
    isLoading: isAnalyticsTotalOrdersByPendingLoading,
    error: analyticsTotalOrdersByPendingError,
  } = useAxiosFetch(
    API_URL +
      API_ENDPOINTS.ANALYTICS_TOTAL_ORDERS_BY_STATUS(ORDER_STATUSES.PENDING),
    {
      startDate: OverviewStartDate,
      endDate: OverviewEndDate,
    }
  );

  const {
    data: analyticsTotalOrdersByCancelledData,
    isLoading: isAnalyticsTotalOrdersByCancelledLoading,
    error: analyticsTotalOrdersByCancelledError,
  } = useAxiosFetch(
    API_URL +
      API_ENDPOINTS.ANALYTICS_TOTAL_ORDERS_BY_STATUS(ORDER_STATUSES.CANCELLED),
    {
      startDate: OverviewStartDate,
      endDate: OverviewEndDate,
    }
  );

  const { orders, totalOrders, totalPages, currentPage } = useMemo(() => {
    return ordersData || {};
  }, [ordersData]);

  const { totalOrders: totalOrdersCount } = analyticsTotalOrdersData || {};

  const { totalOrders: totalOrdersPendingCount } =
    analyticsTotalOrdersByPendingData || {};

  const { totalOrders: totalOrdersCanceledCount } =
    analyticsTotalOrdersByCancelledData || {};

  const { formattedTotalSales } = analyticsTotalSalesData || {};

  const orderBoxes = [
    {
      icon: <PiBasketFill />,
      label: "Total Orders",
      value: totalOrdersCount ? totalOrdersCount : 0,
      trend: "+25",
      trendDirection: "up", // or "down"
      description: "compared last month",
      className: "total-orders",
    },
    {
      icon: <MdOutlineAttachMoney />,
      label: "Total Revenue",
      value: formatCurrency(
        isNaN(formattedTotalSales) ? 0 : formattedTotalSales,
        "USD"
      ),
      trend: "+10",
      trendDirection: "up",
      description: "compared last month",
      className: "total-revenue",
    },
    {
      icon: STATUS_CONFIG[ORDER_STATUSES.PENDING]?.icon,
      label: "Orders in Progress",
      value: isAnalyticsTotalOrdersByPendingLoading ? (
        <LoadingSpinner height={"2rem"} width={"2rem"} />
      ) : totalOrdersPendingCount ? (
        totalOrdersPendingCount
      ) : (
        0
      ),
      trend: "+8",
      trendDirection: "up",
      description: "since last week",
      className: "orders-progress",
    },
    {
      icon: STATUS_CONFIG[ORDER_STATUSES.CANCELLED]?.icon,
      label: "Cancelled Orders",
      value: totalOrdersCanceledCount ? totalOrdersCanceledCount : 0,
      trend: "-5",
      trendDirection: "down",
      description: "compared last month",
      className: "orders-cancelled",
    },

    // {
    //   icon: "🕒",
    //   label: "Pending Orders",
    //   value: "89",
    //   trend: "+2",
    //   trendDirection: "up",
    //   description: "since yesterday",
    // },
  ];

  const handleOpen = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  // function to handle the 'page' param and update the URL
  const updatePageParam = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage);
    setSearchParams(newSearchParams);
  };

  const handleStatusChange = useCallback(
    (value) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", "1");

      if (value === "all") {
        newSearchParams.delete("status");
      } else {
        newSearchParams.set("status", value);
      }

      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  const handleSortChange = useCallback(
    (sortValue) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", "1"); // Reset to page 1

      if (sortValue) {
        newSearchParams.set("sort", sortValue);
      } else {
        newSearchParams.delete("sort");
      }

      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleNextPage = () => {
    if (page >= totalPages) {
      toast.info("You are already on the last page");
      return;
    }

    updatePageParam(+page + 1);
  };

  const handlePreviousPage = () => {
    if (page <= 1) {
      toast.info("You are already on the first page");
      return;
    }

    updatePageParam(+page - 1);
  };

  const PaymentIcon = ({ method }) => {
    switch (method) {
      case "stripe":
        return <FaCcStripe />;
      case "paypal":
        return <FaPaypal />;
      case "cash":
        return <RiMoneyDollarCircleFill />;
      default:
        return null;
    }
  };

  return (
    <div className="orders-page">
      <h1>Orders </h1>
      <div className="order-boxes">
        {orderBoxes.map(
          ({ icon, label, value, trend, description, className }, index) => (
            <OrderBox
              key={index}
              icon={icon}
              label={label}
              value={value}
              trend={trend}
              description={description}
              className={className}
            />
          )
        )}
      </div>
      <div className="orders-charts">
        {/* <OrdersTotalChart title={"total orders"} /> */}
        {/* <OrdersTotalChart title={"orders revenue"} /> */}
        {/* <OrdersTotalChart /> */}
      </div>
      <div className="orders-page-container">
        <header>
          <div>
            <StatusFilterDropdown handleStatusChange={handleStatusChange} />
            {orders && <SortDropdown handleSortChange={handleSortChange} />}
            <div>
              <DatePicker
                updatePageParam={updatePageParam}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
          </div>

          <div className="table-pages-buttons">
            <PreviousBtn
              onClick={handlePreviousPage}
              page={page}
              totalPages={totalPages}
            />

            <NextBtn
              onClick={handleNextPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </header>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>

              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Method</th>

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <TableSkeleton rows={10} />}
            {!isLoading && error && (
              <tr>
                <td colSpan="7" className="error">
                  <span>
                    <p>
                      <MdOutlineErrorOutline />
                      Error loading orders: {error.message}
                    </p>
                    <CustomButton
                      icon={<LiaSortAmountDownAltSolid />}
                      style={{ width: "fit-content" }}
                      text="Retry"
                      onClick={() => {
                        window.location.reload();
                      }}
                    />
                  </span>
                </td>
              </tr>
            )}
            {!isLoading && !error && orders && orders.length === 0 && (
              <tr>
                <td colSpan="7" className="no-orders">
                  <span>
                    <p>
                      <MdOutlineErrorOutline />
                      No orders found.
                    </p>
                    {
                      <CustomButton
                        icon={<LuGalleryVerticalEnd />}
                        style={{ width: "fit-content" }}
                        text="Show all Orders"
                        onClick={() => handleStatusChange("all")}
                      />
                    }
                  </span>
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              orders &&
              orders.length > 0 &&
              orders.map((order) => {
                const status = order.status.toLowerCase();
                const statusClass =
                  STATUS_CONFIG[status]?.className ||
                  STATUS_CONFIG.default.className;
                const statusIcon =
                  STATUS_CONFIG[status]?.icon || STATUS_CONFIG.default.icon;
                const statusDescription =
                  STATUS_CONFIG[status]?.text || STATUS_CONFIG.default.text;

                return (
                  <tr key={order.id} className="order-row">
                    <td className="order-id">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {"#" +
                                order.id.slice(
                                  0,
                                  APP_CONFIG.ORDER_ID_DISPLAY_LENGTH
                                ) +
                                ".."}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="tooltip-content">{order.id}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="email">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>{order.user?.email}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="tooltip-content">
                              {order.user?.firstName +
                                " " +
                                order.user?.lastName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className={`status ${statusClass}`}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span>
                              {statusIcon}
                              {status}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p
                              className={`tooltip-content ${status.className}`}
                            >
                              {statusIcon}

                              {statusDescription}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* {status} */}
                    </td>
                    <td className="date">{formatDate(order.createdAt)}</td>

                    <td className="total">
                      {formatCurrency(+order.totalAmount, "USD")}
                    </td>
                    <td className="payment">
                      <span className={order.paymentMethod}>
                        <PaymentIcon method={order.paymentMethod} />
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="actions">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button className="actions-btn">
                            <HiDotsVertical />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => {
                              handleOpen("showOrder");
                              setSelectedOrderId(order.id);
                            }}
                          >
                            <MdOutlineZoomOutMap />
                            View Order
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onSelect={() => handleOpen("editOrder")}
                          >
                            <MdEditDocument />
                            Edit Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {dialogType === "showOrder" && (
          <DialogShowOrderDetails
            orderData={orderData}
            isOrderDataLoading={isOrderDataLoading}
            orderError={orderError}
          />
        )}
        {dialogType === "editOrder" && <DialogEditOrderDetails />}
      </Dialog>
    </div>
  );
}

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="order-row p-4 gap-4">
          <td className="order-id">
            <Skeleton className="h-8 w-full" />
          </td>

          <td className="email">
            <Skeleton className="h-8 w-full" />
          </td>
          <td className="status ">
            <Skeleton className="h-8 w-full " />
          </td>
          <td className="date">
            <Skeleton className="h-8 w-full" />
          </td>
          <td className="total">
            <Skeleton className="h-8 w-full" />
          </td>
          <td className="payment">
            <Skeleton className="h-8 w-full" />
          </td>
          <td className="actions">
            <div className="flex items-center ">
              <Skeleton className="h-4 w-4 rounded-full" />
              {/* <Skeleton className="h-4 w-20" /> */}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export function StatusFilterDropdown({ handleStatusChange }) {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  // Get initial status from URL params
  const getInitialStatus = () => {
    const urlStatus = searchParams.get("status");
    if (
      urlStatus &&
      statusOptions.find((option) => option.value === urlStatus)
    ) {
      return urlStatus;
    }
    return "all";
  };

  const [selectedStatus, setSelectedStatus] = useState(getInitialStatus);

  // Sync with URL changes
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    const newStatus =
      urlStatus && statusOptions.find((option) => option.value === urlStatus)
        ? urlStatus
        : "all";
    if (newStatus !== selectedStatus) {
      setSelectedStatus(newStatus);
    }
  }, [searchParams, selectedStatus]);

  const checkStatus = (value) => {
    return statusOptions.find((status) => status.value === value);
  };

  const handleStatusSelect = (statusValue) => {
    let newStatus;

    if (statusValue === selectedStatus) {
      // If clicking the same status, toggle back to 'all'
      newStatus = "all";
    } else {
      // If clicking a different status, select it
      newStatus = statusValue;
    }

    setSelectedStatus(newStatus);
    setOpen(false);
    handleStatusChange(newStatus);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="gap-1 " asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={
            "w-[200px] rounded-full " +
            (selectedStatus && selectedStatus !== "all"
              ? checkStatus(selectedStatus)?.className
              : "")
          }
        >
          {checkStatus(selectedStatus)?.icon || <RiFilterFill />}
          {selectedStatus && selectedStatus !== "all"
            ? checkStatus(selectedStatus)?.label
            : "Filters"}
          <HiSwitchVertical className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {/* <CommandInput placeholder="Search status..." className="h-10" /> */}
          <CommandList>
            <CommandEmpty>No Status found.</CommandEmpty>
            <CommandGroup>
              {statusOptions.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => handleStatusSelect(status.value)}
                >
                  {status.icon}
                  {status.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedStatus === status.value.toLocaleLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SortDropdown({ handleSortChange }) {
  const [open, setOpen] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState("");

  const getSortOption = (value) => {
    return sortOptions.find((option) => option.value === value);
  };

  const selectedOption = getSortOption(selectedSort);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="gap-1" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] rounded-full", selectedOption?.className)}
        >
          {selectedSort ? selectedOption?.icon : <RiFilterFill />}
          {selectedSort ? selectedOption?.label : "Sort By"}
          <HiSwitchVertical className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No Sort Option found.</CommandEmpty>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setSelectedSort(
                      currentValue === selectedSort ? "" : currentValue
                    );
                    setOpen(false);
                    handleSortChange(option.value);
                  }}
                >
                  {option.icon}
                  {option.label}

                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSort === option.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export function OrdersTotalChart({ title, desc }) {
  const chartData = [
    { month: "January", desktop: 18622 },
    { month: "February", desktop: 30522 },
    { month: "March", desktop: 23000 },
    { month: "April", desktop: 73023 },
    { month: "May", desktop: 20922 },
    { month: "June", desktop: 21422 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--color-3)",
    },
  };
  return (
    <Card
      style={{
        border: "none",
        boxShadow: "var(--box-shadow-content-container)",
      }}
    >
      <CardHeader>
        <CardTitle
          style={{ fontFamily: "var(--font-1)", textTransform: "capitalize" }}
        >
          {title}
        </CardTitle>
        {/* <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 2,
              right: 2,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              domain={[0, "auto"]}
              tickFormatter={(value) => {
                if (value >= 1_000_000_000)
                  return `${(value / 1_000_000_000).toFixed(1)}B`;
                if (value >= 1_000_000)
                  return `${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
                return value;
              }}
            /> */}

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-5)"
              fillOpacity={0.2}
              stroke="var(--color-5)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}

const OrderBox = ({
  icon,
  label,
  value,
  trend,
  trendDirection,
  description,
  className,
}) => {
  return (
    <div className={`order-box ${className}`}>
      <div>
        <span className="box-icon">{icon}</span>
        <span className="label">{label}</span>
      </div>
      <span className="value">{value}</span>
      <div>
        <p className={`trend ${+trend > 0 ? "up" : "down"}`}>
          {trend > 0 ? <TrendingUp /> : <TrendingDown />}
          {trend}%
        </p>
        <span className="desc">{description || "compared last month"}</span>
      </div>
    </div>
  );
};

function DatePicker({ startDate, endDate }) {
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const today = new Date();

  const handleStartDateSelect = (date) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", 1);

    if (!date) {
      // Deselect: remove both start & end dates
      newParams.delete("startDate");
      newParams.delete("endDate");
    } else {
      const formatted = formatDateToYMD(date);
      const todayFormatted = formatDateToYMD(today);

      newParams.set("startDate", formatted);

      // If no endDate, auto set to today
      if (endDate) {
        newParams.set("endDate", todayFormatted);
      }
    }

    setSearchParams(newParams);
    setStartOpen(false);
    setEndOpen(true); // Open end date picker after selecting start date
  };

  const handleEndDateSelect = (date) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("page", 1);
    if (!date) {
      newParams.delete("endDate");
    } else {
      const formatted = formatDateToYMD(date);
      newParams.set("endDate", formatted);
    }

    setSearchParams(newParams);
    setEndOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {/* Start Date Picker */}
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal text-left"
            >
              <span className="flex items-center gap-2">
                {startDate || "From Date"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate ? new Date(startDate) : undefined}
              onSelect={handleStartDateSelect}
              captionLayout="dropdown"
              disabled={(date) =>
                date > today || (endDate && date > new Date(endDate))
              }
            />
          </PopoverContent>
        </Popover>

        {/* End Date Picker */}
        {startDate && (
          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-between font-normal text-left"
              >
                <span className="flex items-center gap-2">
                  {endDate || "To Date"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={handleEndDateSelect}
                captionLayout="dropdown"
                disabled={(date) =>
                  date > today || (startDate && date < new Date(startDate))
                }
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
