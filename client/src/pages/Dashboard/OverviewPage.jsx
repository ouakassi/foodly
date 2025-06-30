import "./OverviewPage.css";

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

import { TrendingUp } from "lucide-react";
import OrdersAndRevenuesChart from "./OrdersAndRevenuesChart";

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

import { FaBoxes } from "react-icons/fa";
import { MdMonetizationOn } from "react-icons/md";
import { BsArchive, BsArrowReturnRight } from "react-icons/bs";
import { FaUserLarge } from "react-icons/fa6";
import { BsBagCheckFill } from "react-icons/bs";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import ProductCard from "../../components/Product/ProductCard";
import ProductRow from "../../components/Product/ProductRow";
import CustomButton from "../../components/Buttons/CustomButton";
import ProductHeader from "../../components/Product/ProductHeader";
import PageTitle from "../../components/Dashboard/PageTitle";
import { LINKS_WITH_ICONS } from "../../constants";

export default function OverviewPage() {
  const dataBoxes = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <FaUserLarge />,
      change: 12.5, // % change
      trend: true, // true = up, false = down
    },
    {
      title: "Total Orders",
      value: "982",
      icon: <BsBagCheckFill />,
      change: 5.1,
      trend: true,
    },
    {
      title: "Total Revenue",
      value: "$24,300",
      icon: <MdMonetizationOn />,
      change: -3.4,
      trend: false,
    },
    {
      title: "Total Products",
      value: "215",
      icon: <BsArchive />,
      change: null,
      trend: null, // optional: no change
    },
  ];

  const tableHeaders = [
    { title: "Image" },
    {
      title: "Name",

      // isSortable: true,
      value: "name_asc",
    },
    { title: "Status" },
    {
      title: "Stock",

      // isSortable: true,
      value: "stock_asc",
    },
    {
      title: "Price",

      // isSortable: true,
      value: "price_asc",
    },
    { title: "Category" },
    { title: "Discount" },
    {
      title: "Published",

      // isSortable: true,
      value: "createdAt_asc",
    },
    // { title: "Action" },
    // { title: "Orders", icon: <BiBasket /> },
    // { title: "Rating", icon: <CiStar /> },
  ];

  const product = {
    id: "e3b9425b-2b6c-41cb-9b3a-312d3e52a8fe",
    name: "Almond Oil",
    imgUrl:
      "https://res.cloudinary.com/djfsxp9z0/image/upload/v1742571332/products/weed/6172705011f98cfbe6f5304a764fc862.png",
    price: 45.99,
    status: true,
    stock: 25,
    discount: 15,
    category: "Oils",
    createdAt: "2025-04-29T08:20:00.000Z",
    updatedAt: "2025-04-29T08:20:00.000Z",
  };

  return (
    <section className="overview-page">
      <PageTitle
        icon={React.createElement(LINKS_WITH_ICONS.overview.icon)}
        title={LINKS_WITH_ICONS.overview.label}
      />
      <div className="data-boxes">
        {dataBoxes.map(({ title, value, icon, change, trend }, index) => (
          <DataBox
            key={index}
            title={title}
            value={value}
            icon={icon}
            change={change}
            trend={trend}
          />
        ))}
      </div>

      <div className="charts">
        <OrdersAndRevenuesChart />
        {/* <div className="chart revenue-chart">
        <NewSignUpChart />
        <TopSellingCategoriesChart />

        </div> */}
      </div>
      <div className="last-product">
        <header>
          <h2>last products</h2>
          <Link to="/dashboard/products">
            <CustomButton
              icon={<BsArrowReturnRight />}
              className="all-products-btn"
              text={"show all products"}
            />
          </Link>
        </header>
        <table style={{ width: "100%" }}>
          <ProductHeader headers={tableHeaders} />
          <tbody>
            {product && <ProductRow product={product} />}
            {product && <ProductRow product={product} />}
            {product && <ProductRow product={product} />}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const DataBox = ({ title, value, icon, trend, change }) => {
  return (
    <div className="data-box">
      <div>
        <h2>{title}</h2>
        <div>
          <p className="data__value">{value}</p>
          {/* <p className="data__description">This month</p> */}
          {change && (
            <span className="sign">
              {trend ? (
                <span className="sign-up">
                  {change}% <FaArrowTrendUp />
                </span>
              ) : (
                <span className="sign-down">
                  {change}% <FaArrowTrendDown />
                </span>
              )}
              <span className="sign__text">compared to last month</span>
            </span>
          )}
        </div>
      </div>
      <div className="data__icon">{icon}</div>
    </div>
  );
};

export function NewSignUpChart() {
  const chartData = [
    { month: "January", users: 186 },
    { month: "February", users: 305 },
    { month: "March", users: 237 },
    { month: "April", users: 73 },
    { month: "May", users: 209 },
    { month: "June", users: 214 },
  ];

  const chartConfig = {
    users: {
      label: "Users",
      color: "hsl(var(--chart-1))",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users Total</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sells for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export function TopSellingCategoriesChart() {
  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const pastMonth = date - 1000 * 60 * 60 * 24 * 30;
  console.log(pastMonth.toLocaleString("default", { month: "long" }));
  const chartData = [
    { browser: "oils", sells: 275, fill: "var(--color-3)" },
    { browser: "nuts", sells: 200, fill: "var(--color-4)" },
    { browser: "coffees", sells: 187, fill: "var(--color-3)" },
    { browser: "herbs", sells: 173, fill: "var(--color-5)" },
  ];

  const chartConfig = {
    sells: {
      label: "Sells",
    },
    oils: {
      label: "Oils",
      color: "var(--chart-1)",
    },
    nuts: {
      label: "Nuts",
      color: "var(--chart-2)",
    },
    coffees: {
      label: "Coffees",
      color: "var(--chart-3)",
    },
    herbs: {
      label: "Herbs",
      color: "var(--chart-4)",
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Selling Categories </CardTitle>
        <CardDescription>
          {pastMonth} - {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value]?.label}
            />
            <XAxis dataKey="sells" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="sells" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sells for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
