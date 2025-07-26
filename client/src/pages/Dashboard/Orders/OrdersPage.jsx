import "./OrdersPage.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LiaRedoAltSolid, LiaSortAmountDownAltSolid } from "react-icons/lia";
import { Skeleton } from "@/components/ui/skeleton";

import {
  BiSolidCalendarCheck,
  BiCalendarPlus,
  BiInfoCircle,
} from "react-icons/bi";

import {
  MdEditDocument,
  MdOutlineErrorOutline,
  MdOutlineZoomOutMap,
} from "react-icons/md";

import { HiDotsVertical, HiSwitchVertical } from "react-icons/hi";
import { Check, ChevronDown } from "lucide-react";

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

import {
  RiDeleteBin6Fill,
  RiFilterFill,
  RiMoneyDollarCircleFill,
} from "react-icons/ri";
import { FaCcStripe, FaPaypal } from "react-icons/fa";

import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { TableBtns } from "../../../components/Table/TableBtns";
import {
  formatCurrency,
  formatDate,
  formatDateToYMD,
} from "../../../lib/helpers";
import CustomButton from "../../../components/Buttons/CustomButton";
import DialogEditOrderDetails from "./dialogs/DialogEditOrderDetails";
import DialogShowOrderDetails from "./dialogs/DialogShowOrderDetails";
import { sortOptions, statusOptions } from "../../../constants/orderFilters";

import {
  API_ENDPOINTS,
  APP_CONFIG,
  LINKS_WITH_ICONS,
} from "../../../constants/index";

import { Calendar } from "@/components/ui/calendar";
import {
  NoDataFound,
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import PageTitle from "../../../components/Dashboard/PageTitle";
import OrdersOverview from "./OrdersOverview";
import { ORDER_STATUSES } from "../../../constants/orderStatus";

const orderColumns = [
  "Order ID",
  "Email",
  "Status",
  "Date",
  "Total",
  "Payment",
  "Actions",
];

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

  const { orders, totalOrders, totalPages, currentPage } = useMemo(() => {
    return ordersData || {};
  }, [ordersData]);

  const handleOpen = useCallback((type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  }, []);

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

  const clearParams = () => {
    setSearchParams({});
  };

  const handleSelectOrderId = (id) => {
    setSelectedOrderId(id);
  };

  return (
    <section className="page orders-page">
      <PageTitle
        icon={React.createElement(LINKS_WITH_ICONS.orders.icon)}
        title={LINKS_WITH_ICONS.orders.label}
        badge={totalOrders || 0}
      />
      <div className="order-boxes">
        <OrdersOverview />
      </div>

      <div className="orders-page-container">
        <header>
          <div className="table-filters">
            <StatusFilterDropdown handleStatusChange={handleStatusChange} />
            {orders && <SortDropdown />}

            <DatePicker
              updatePageParam={updatePageParam}
              startDate={startDate}
              endDate={endDate}
            />
            {(status || startDate || endDate) && (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger>
                    <CustomButton
                      icon={<RiDeleteBin6Fill />}
                      style={{
                        width: "fit-content",
                        background: "linear-gradient(359deg, #b50000, #ef0303)",
                        padding: "0.3rem 0.6rem ",
                      }}
                      // text="Reset"
                      onClick={clearParams}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="tooltip-content">Clear all filters</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <TableBtns
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            page={page}
            totalPages={totalPages}
          />
        </header>
        <div className="table-container">
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            error={error}
            PaymentIcon={PaymentIcon}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            currentPage={currentPage}
            totalPages={totalPages}
            clearParams={clearParams}
            handleOpen={handleOpen}
            onSelectOrderId={handleSelectOrderId}
            limit={limit}
          />
        </div>
        <footer className="table-footer">
          <TableBtns
            showPageNumber={true}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            page={page}
            totalPages={totalPages}
          />
        </footer>
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
    </section>
  );
}

const TableSkeleton = ({ rows = 5, columns = 1 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="order-row p-8 ">
          <td className="order-id" colSpan={columns}>
            <Skeleton className="h-8 w-full" />
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

export function SortDropdown({
  className,
  placeholder = "Sort By",
  width = "w-[200px]",
}) {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current sort from URL
  const currentSort = searchParams.get("sort") || "";

  // Find the selected option based on URL params
  const selectedOption = useMemo(() => {
    return sortOptions.find((option) => option.value === currentSort);
  }, [currentSort]);

  // Handle sort selection
  const handleSortSelect = (sortValue) => {
    const newParams = new URLSearchParams(searchParams);

    if (sortValue === currentSort) {
      // Toggle off - remove sort
      newParams.delete("sort");
    } else {
      // Set new sort value
      newParams.set("sort", sortValue);
      // Reset to first page when sorting changes
      newParams.set("page", "1");
    }

    setSearchParams(newParams);
    setOpen(false);

    // Call parent handler if provided
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={
              selectedOption ? `Sorted by ${selectedOption.label}` : placeholder
            }
            className={cn(
              width,
              "justify-between rounded-full gap-2",
              selectedOption?.className,
              className
            )}
          >
            <div className="flex items-center gap-2">
              {selectedOption ? selectedOption.icon : <RiFilterFill />}
              <span className="truncate">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <HiSwitchVertical className="h-4 w-4 opacity-50 flex-shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No sort options found.</CommandEmpty>
              <CommandGroup>
                {sortOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSortSelect(option.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        currentSort === option.value
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
    </div>
  );
}

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
    !endDate && setEndOpen(true); // Open end date picker after selecting start date
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
              style={
                startDate ? { backgroundColor: "#16a34a", color: "white" } : {}
              }
              className="w-48 justify-between font-normal text-left"
            >
              <span className="flex items-center gap-2 ">
                {startDate ? (
                  <BiSolidCalendarCheck
                    fontSize={"1.2rem"}
                    // color="var(--color-3)"
                  />
                ) : (
                  <BiCalendarPlus fontSize={"1.2rem"} />
                )}
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
                style={
                  endDate
                    ? {
                        backgroundColor: "#16a34a",
                        color: "white",
                      }
                    : {}
                }
                variant="outline"
                className="w-48 justify-between font-normal text-left"
              >
                <span className="flex items-center gap-2">
                  {endDate ? (
                    <BiSolidCalendarCheck fontSize={"1.2rem"} />
                  ) : (
                    <BiCalendarPlus fontSize={"1.2rem"} />
                  )}

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

const OrdersTable = ({
  orders,
  isLoading,
  error,
  PaymentIcon,
  clearParams,
  handleOpen,
  onSelectOrderId,
}) => {
  return (
    <Table className="orders-table">
      <TableHead columns={orderColumns} />

      {!isLoading && error && (
        <NoDataFound
          message="Error loading orders"
          onClick={() => window.location.reload()}
          btnText="Retry"
          className="error"
          columnsCount={orderColumns.length}
        />
      )}
      {!isLoading && !error && !orders && (
        <NoDataFound
          onClick={clearParams}
          message="no orders found"
          columnsCount={orderColumns.length}
        />
      )}
      <TableBody>
        {isLoading && <TableSkeleton rows={10} columns={orderColumns.length} />}

        {!isLoading &&
          !error &&
          orders &&
          orders.map((order) => {
            const getStatusConfig = (statusValue) => {
              return Object.values(ORDER_STATUSES).find(
                (status) => status.value === statusValue
              );
            };
            const DEFAULT_STATUS_CONFIG = {
              className: "status-unknown",
              icon: <BiInfoCircle />,
              text: "Unknown status",
            };
            const status = order.status.toLowerCase();
            const statusConfig =
              getStatusConfig(status) || DEFAULT_STATUS_CONFIG;

            const statusClass = statusConfig.className;
            const statusIcon = statusConfig.icon;
            const statusDescription = statusConfig.text;

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
                          {order.user?.firstName + " " + order.user?.lastName}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className={`status`}>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={statusClass}>
                          {statusIcon}
                          {status}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className={`tooltip-content ${status.className}`}>
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
                    <PaymentIcon method={order.paymentMethod.toLowerCase()} />
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
                          onSelectOrderId(order.id);
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
      </TableBody>
    </Table>
  );
};
