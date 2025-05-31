import "./OrdersPage.css";
import React, { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

import { LuGalleryVerticalEnd } from "react-icons/lu";

import {
  BiLoader,
  BiInfoCircle,
  BiRotateLeft,
  BiTimeFive,
  BiCheckCircle,
  BiXCircle,
  BiCalendar,
  BiMinusCircle,
} from "react-icons/bi";
import {
  MdDateRange,
  MdEditDocument,
  MdEmail,
  MdOutlineAttachMoney,
  MdOutlineFactCheck,
  MdOutlineLocalShipping,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { PiAirplaneTaxiingThin, PiBasketFill } from "react-icons/pi";

import {
  BsBagCheckFill,
  BsCreditCard2Back,
  BsFillSendCheckFill,
} from "react-icons/bs";
import {
  HiDotsVertical,
  HiOutlineDotsHorizontal,
  HiSwitchVertical,
} from "react-icons/hi";
import { Check, TrendingUp, TrendingDown } from "lucide-react";

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/api/api";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RiFilterFill, RiIdCardLine, RiProgress1Line } from "react-icons/ri";
import {
  FaAddressCard,
  FaCcStripe,
  FaPaypal,
  FaPhone,
  FaRegFileAlt,
  FaShippingFast,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import ContentContainer from "../../../components/Dashboard/ContentContainer";
import ProductRow from "../../../components/Product/ProductRow";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import { NextBtn, PreviousBtn } from "../../../components/Table/TableBtns";

const statusConfig = {
  completed: {
    icon: <BiCheckCircle />,
    className: "status-completed",
    text: "Order completed successfully",
  },
  pending: {
    icon: <BiLoader />,
    className: "status-pending",
    text: "Awaiting confirmation or payment",
  },
  cancelled: {
    icon: <BiRotateLeft />,
    className: "status-cancelled",
    text: "Order was cancelled",
  },
  refunded: {
    icon: <BiInfoCircle />,
    className: "status-refunded",
    text: "Customer refunded",
  },
  shipped: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Shipped to customer",
  },
  delivered: {
    icon: <MdOutlineLocalShipping />,
    className: "status-shipped",
    text: "Shipped to customer",
  },
  processing: {
    icon: <BiLoader />,
    className: "status-processing",
    text: "Order is being processed",
  },
  "In Progress": {
    icon: <BiLoader />,
    className: "status-in-progress",
    text: "Order is in progress",
  },
  "Not Fulfilled": {
    icon: <BiInfoCircle />,
    className: "status-not-fulfilled",
    text: "Order not yet fulfilled",
  },
  "Not Applicable": {
    icon: <BiInfoCircle />,
    className: "status-not-applicable",
    text: "No fulfillment required",
  },
};

export default function OrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("none");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "";
  const status = searchParams.get("status");

  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const params = {
    ...(search && { search: debouncedSearch }),
    limit: limit,
    page: page,
    ...(status !== "all" && { status: status }),
    sort: sort ? sort : {},
  };

  const { data, loading, error } = useAxiosFetch(
    API_URL + "/api/orders",
    params
  );
  console.log(data);
  const { orders, totalOrders, totalPages, currentPage } = data || {};

  const orderBoxes = [
    {
      icon: <PiBasketFill />,
      label: "Total Orders",
      value: totalOrders,
      trend: "+25",
      trendDirection: "up", // or "down"
      description: "compared last month",
    },
    {
      icon: <MdOutlineAttachMoney />,
      label: "Total Revenue",
      value: "$120,000",
      trend: "+10",
      trendDirection: "up",
      description: "compared last month",
    },
    {
      icon: <RiProgress1Line />,
      label: "Orders in Progress",
      value: "320",
      trend: "+8",
      trendDirection: "up",
      description: "since last week",
    },
    {
      icon: <BiRotateLeft />,
      label: "Cancelled Orders",
      value: "45",
      trend: "-5",
      trendDirection: "down",
      description: "compared last month",
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

  // function to handle the 'page' param and update the URL
  const updatePageParam = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage);
    setSearchParams(newSearchParams);
  };

  const handleStatusChange = (value) => {
    // reset the 'status' param and 'page'
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("status", value);
    newSearchParams.set("page", 1);

    setSearchParams(newSearchParams);
  };

  const handleOpen = (type) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

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

  const formattedCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const PaymentIcon = ({ method }) => {
    switch (method) {
      case "stripe":
        return <FaCcStripe />;
      case "paypal":
        return <FaPaypal />;
      default:
        return null;
    }
  };

  if (loading) return <p>Loading orders...</p>; // Or a spinner component
  if (error) return <p>Error fetching orders: {error.message}</p>;
  if (!orders || orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-page">
      <h1>Orders </h1>
      <div className="order-boxes">
        {orderBoxes.map(({ icon, label, value, trend, description }, index) => (
          <OrderBox
            key={index}
            icon={icon}
            label={label}
            value={value}
            trend={trend}
            description={description}
          />
        ))}
      </div>
      <div className="orders-charts">
        {/* <OrdersTotalChart title={"total orders"} /> */}
        {/* <OrdersTotalChart title={"orders revenue"} /> */}
        {/* <OrdersTotalChart /> */}
      </div>
      <div className="orders-page-container">
        <header>
          <ComboboxDemo handleStatusChange={handleStatusChange} />
          <div className="table-pages-buttons">
            <PreviousBtn onClick={handlePreviousPage} page={page} />

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
            {orders &&
              orders.map((order) => (
                <tr>
                  <td className="order-id">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <span>{"#" + order.id.slice(0, 8) + ".."}</span>
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
                          <span>{order.user.email}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="tooltip-content">
                            {order.user.firstName + " " + order.user.lastName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td
                    className={`status ${statusConfig[order.status].className}`}
                  >
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger>
                          <span>
                            {statusConfig[order.status].icon}
                            {order.status}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p
                            className={`tooltip-content ${
                              statusConfig[order.status].className
                            }`}
                          >
                            {statusConfig[order.status].icon}

                            {statusConfig[order.status].text}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* {status} */}
                  </td>
                  <td className="date">{formatDate(order.createdAt)}</td>

                  <td className="total">
                    {formattedCurrency(order.totalAmount, "MAD")}
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
                          onSelect={() => handleOpen("showOrder")}
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      {dialogType === "showOrder" && <DialogShowOrderDetails />}
                      {dialogType === "editOrder" && <DialogEditOrderDetails />}
                    </Dialog>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const DialogShowOrderDetails = ({ order }) => {
  return (
    <DialogContent className="w-auto max-w-full min-h-[80vh] max-h-full">
      <DialogHeader>
        <DialogTitle>
          <FaRegFileAlt className="icon" />
          Order N-232321{" "}
          {/* <span className={`status ${statusConfig["Completed"].className}`}>
            {statusConfig[calculateOrderStatus("Paid", "Delivered")].icon}
            {calculateOrderStatus("Paid", "Delivered")}
          </span> */}
        </DialogTitle>
      </DialogHeader>
      <div className="order-details-buttons">
        <Tabs defaultValue="details" className="w-[400px]">
          <TabsList style={{ padding: "1.5rem 1rem" }}>
            <TabsTrigger style={{ padding: "0.5rem" }} value="details">
              🧾 Order Details{" "}
            </TabsTrigger>
            <TabsTrigger value="Customer">👤 Customer Information</TabsTrigger>
            <TabsTrigger value="Items">📦 Order Items</TabsTrigger>
            <TabsTrigger value="shipping">💳 Payment & Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <ContentContainer
              className="order-details-content"
              title={
                <>
                  <FaRegFileAlt className="icon" />
                  Order Details – Order #20438
                </>
              }
            >
              <p className="order-date">
                <span>
                  <strong>
                    <MdDateRange className="icon" />
                    Order Date:
                  </strong>
                </span>
                <span>May 6, 2025, 2:14 PM</span>
              </p>

              {/* <p className="order-status">
                <span>
                  <strong>
                    <PiAirplaneTaxiingThin className="icon" />
                    Status:
                  </strong>
                </span>
                <span
                  className={`status ${statusConfig["Completed"].className}`}
                >
                  {statusConfig[calculateOrderStatus("Paid", "Delivered")].icon}
                  {calculateOrderStatus("Paid", "Delivered")}
                </span>
              </p> */}

              <p className="payment-status">
                <span>
                  <strong>
                    <BsCreditCard2Back className="icon" />
                    Payment Status:
                  </strong>
                </span>
                <span>Paid </span>
              </p>

              <p className="delivery-method">
                <span>
                  <strong>
                    <FaShippingFast className="icon" />
                    Delivery Method:
                  </strong>
                </span>
                <span>Aramex Express</span>
              </p>

              <p className="tracking-number">
                <span>
                  <strong>
                    <HiOutlineDotsHorizontal className="icon" />
                    Tracking Number:
                  </strong>
                </span>
                <span>ARX982734983</span>
              </p>
            </ContentContainer>
          </TabsContent>
          <TabsContent value="Customer">
            <ContentContainer
              className={"order-details-content"}
              title={
                <>
                  <FaUser className="icon" />
                  Customer Information
                </>
              }
            >
              <p>
                <span>
                  <RiIdCardLine className="icon" />
                  <strong>Name:</strong>
                </span>
                <span>Fatima El Amrani</span>
              </p>

              <p>
                <span>
                  <MdEmail className="icon" />
                  <strong>Email:</strong>
                </span>
                <span>fatima@example.com</span>
              </p>

              <p>
                <span>
                  <FaPhone className="icon" />
                  <strong>Phone:</strong>
                </span>
                <span>+212 600-000000</span>
              </p>

              <p>
                <span>
                  <FaAddressCard className="icon" />
                  <strong>Billing Address:</strong>
                </span>
                <span>23 Rue Hassan II, Casablanca, Morocco</span>
              </p>

              <p>
                <span>
                  <FaShippingFast className="icon" />
                  <strong>Shipping Address:</strong>
                </span>
                <span>23 Rue Hassan II, Casablanca, Morocco</span>
              </p>
            </ContentContainer>
          </TabsContent>

          <TabsContent value="Items">
            <ContentContainer
              className={"order-details-content"}
              title={<>📦 Order Items</>}
            >
              <table>
                <tr>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>

                <OrderRow
                  order={{
                    productName: "Dark Herbs",
                    productImg:
                      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1727295271/products/coffees/6172705011f98cfbe6f5304a764fc862.png",
                    formattedPrice: 255,
                    quantity: 2,
                    orderDate: 2024,
                  }}
                />
                <OrderRow
                  order={{
                    productName: "Dark Herbs",
                    productImg:
                      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1727295271/products/coffees/6172705011f98cfbe6f5304a764fc862.png",
                    formattedPrice: 255,
                    quantity: 2,
                    orderDate: 2024,
                  }}
                />
              </table>
              <div class="order-summary">
                <p>
                  <strong>Subtotal:</strong> $40.00
                </p>
                <p>
                  <strong>Shipping:</strong> $4.99
                </p>
                <p>
                  <strong>Discount:</strong> -$5.00 (SPRING5)
                </p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span class="total-amount">$39.99</span>
                </p>
              </div>
            </ContentContainer>
          </TabsContent>
          <TabsContent value="shipping">
            <ContentContainer
              className={"order-details-content"}
              title={
                <>
                  <h3>📦 Order Items</h3>
                </>
              }
            >
              <p>
                <strong>Payment Method:</strong> Credit Card (Stripe)
              </p>
              <p>
                <strong>Transaction ID:</strong> pi_34sdklfj9348sdlkj
              </p>
            </ContentContainer>
            <ContentContainer title={<>🚚 Shipping Information</>}>
              <p>
                <strong>Courier:</strong> Aramex
              </p>
              <p>
                <strong>Tracking Number:</strong> ARX982734983
              </p>
              <p>
                <strong>Estimated Delivery:</strong> May 9, 2025
              </p>
              <p>
                <strong>Delivered On:</strong> May 8, 2025
              </p>
            </ContentContainer>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
};
const DialogEditOrderDetails = ({ order }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Order</DialogTitle>
      </DialogHeader>
      <p>Form to edit the order will go here.</p>
      <input type="checkbox" />
      <button>Submit</button>
    </DialogContent>
  );
};
const statusOptions = [
  {
    value: "All",
    label: "All",
    icon: <LuGalleryVerticalEnd />,
  },

  {
    value: "Completed",
    label: "Completed",
    icon: <BiCheckCircle />,
  },
  {
    value: "Pending",
    label: "Pending",
    icon: <BiLoader />,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: <BiRotateLeft />,
  },
  {
    value: "Refunded",
    label: "Refunded",
    icon: <BiInfoCircle />,
  },
  {
    value: "Shipped",
    label: "Shipped",
    icon: <MdOutlineLocalShipping />,
  },
  {
    value: "Processing",
    label: "Processing",
    icon: <BiLoader />,
  },
];

export function ComboboxDemo({ handleStatusChange }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="gap-2" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] "
        >
          {value ? (
            statusOptions.find((status) => status.value === value)?.icon
          ) : (
            <RiFilterFill />
          )}
          {value
            ? statusOptions.find((status) => status.value === value)?.label
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
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    handleStatusChange(status.value.toLowerCase());
                  }}
                >
                  {status.icon}
                  {status.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === status.value ? "opacity-100" : "opacity-0"
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
      color: "var(--color-3",
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
}) => {
  return (
    <div className="order-box">
      <div>
        <span>{icon}</span>
        <span>{label}</span>
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

const OrderRow = ({ order }) => (
  <tr className="order-row">
    <td>
      <img
        src={order.productImg}
        alt={order.productName}
        className="product-img"
      />
    </td>
    <td className="name">{order.productName}</td>
    <td className="quantity">{order.quantity}</td>
    <td className="price">{order.formattedPrice}</td>
    <td className="date">{order.orderDate}</td>
  </tr>
);
