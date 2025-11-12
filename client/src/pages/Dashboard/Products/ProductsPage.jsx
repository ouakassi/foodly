import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import "./ProductsPage.css";

// UI Components
import CustomButton from "@/components/Buttons/CustomButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import InputContainer from "../../../components/Forms/InputContainer";

import PageTitle from "../../../components/Dashboard/PageTitle";
import {
  NoDataFound,
  Table,
  TableBody,
  TableHead,
} from "../../../components/Table/TableComponents";
import {
  NextBtn,
  PagesCount,
  PreviousBtn,
  TableBtns,
} from "../../../components/Table/TableBtns";

// Dialogs & Tooltips
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Icons
import { BsPlusCircleFill, BsShieldCheck, BsShieldX } from "react-icons/bs";
import { CiGrid41, CiWarning } from "react-icons/ci";
import { FaArrowTrendDown } from "react-icons/fa6";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { TbSearch, TbForbid2 } from "react-icons/tb";

// API & Hooks
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useDebounce from "../../../hooks/useDebounce";
import { axiosInstance, API_URL } from "../../../api/api";

// Constants & Helpers
import {
  API_ENDPOINTS,
  APP_CONFIG,
  APP_LINKS,
  LINKS_WITH_ICONS,
} from "../../../constants";
import { formatCurrency, formatDate } from "../../../lib/helpers";

// Notifications
import { toast } from "sonner";
import Badge from "../../../components/Badge";

const tableHeaders = [
  "Image",
  "Name",
  "Status",
  "Stock",
  "Price",
  "Category",
  "Published",
  "Actions",
];

const buttonStyle = {
  color: "white",
  borderRadius: "5px",
  padding: "2px 5px",
  maxWidth: "max-content",
  fontSize: "var(--fs-l)",
  boxShadow: "none",
  cursor: "pointer",
  backgroundColor: "white",
  boxShadow: "var(--box-shadow-content-container)",
};

const statusOptions = [
  { value: "all", label: "All", className: "all" },
  { value: "active", label: "Active", className: "active" },
  { value: "inactive", label: "Inactive", className: "inactive" },
  { value: "draft", label: "Draft", className: "draft" },
];

export default function ProductsPage() {
  const [limitPerPage, setLimitPerPage] = useState(10);

  const [searchParams, setSearchParams] = useSearchParams();

  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "name_asc";
  const status = searchParams.get("status");

  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  const params = {
    ...(search && { search: debouncedSearch }),
    limit: limitPerPage,
    page: page,
    ...(status !== "all" && { status: status }),
    sort: sort,
  };

  const { data, isLoading, error, refetch } = useAxiosFetch(
    API_URL + API_ENDPOINTS.PRODUCTS,
    params
  );

  console.log(data);

  const { data: productsData, count, pagination } = data || {};

  const {
    draftProductsCount = 0,
    allProductsCount = 0,
    activeProductsCount = 0,
    inactiveProductsCount = 0,
  } = count || {};

  const { totalPages = 1, currentPage = 1 } = pagination || {};

  console.log(productsData);

  let throttleTimer;
  const throttle = (func, limit) => {
    if (!throttleTimer) {
      throttleTimer = setTimeout(() => {
        func();
        throttleTimer = null;
      }, limit);
    }
  };
  const tabs = [
    {
      value: "all",
      label: "All",
      icon: <CiGrid41 className="icon" />,
      count: allProductsCount || 0,
    },
    {
      value: "active",
      label: "Active",
      icon: <BsShieldCheck className="icon" />,
      count: activeProductsCount,
    },
    {
      value: "inactive",
      label: "Inactive",
      icon: <BsShieldX className="icon" />,
      count: inactiveProductsCount,
    },
    // {
    //   value: "low-stock",
    //   label: "Low Stock",
    //   icon: <CiWarning className="icon" />,
    //   count: lowStockProductsCount,
    // },

    {
      value: "draft",
      label: "Draft",
      icon: <CiGrid41 className="icon" />,
      count: draftProductsCount,
    },
  ];
  useEffect(() => {
    let lastPressTime = 0;
    const handleKeyPress = (e) => {
      const now = Date.now();

      // If less than 250ms seconds since last valid press, skip
      if (now - lastPressTime < 250) return;

      if (e.key === "ArrowLeft") {
        prevBtnRef.current?.click();
      } else if (e.key === "ArrowRight") {
        nextBtnRef.current?.click();
      }
      lastPressTime = now;
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nextBtnRef, prevBtnRef]);

  // function to handle the 'page' param and update the URL
  const updatePageParam = (newPage) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage);
    setSearchParams(newSearchParams);
  };

  const handleTabChange = (value) => {
    // reset the 'status' param and 'page'
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("status", value);
    newSearchParams.set("page", 1);

    setSearchParams(newSearchParams);
  };

  const handleDeleteProduct = async (id) => {
    if (!id) {
      toast.error("Please select a product to delete");
      return;
    }
    try {
      await axiosInstance.put(API_ENDPOINTS.PRODUCT_DELETE(id));
      toast.success("Product Deleted Successfully");

      const updatedProducts = productsData.filter((p) => p.id !== id);

      // Go to previous page if this was the last product on the current page
      if (updatedProducts.length === 0 && page > 1) {
        updatePageParam(+page - 1);
      } else {
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSearchParamChange = (e) => {
    const value = e.target.value;

    const newParams = new URLSearchParams(searchParams);

    // ✅ remove search param if empty
    if (value.trim() === "") {
      newParams.delete("search");
    } else {
      newParams.set("search", value);
    }

    newParams.set("page", "1");
    setSearchParams(newParams);
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

  return (
    <section className="page products-page">
      <header>
        <PageTitle
          icon={React.createElement(LINKS_WITH_ICONS.products.icon)}
          title={LINKS_WITH_ICONS.products.label}
          badge={allProductsCount}
        />

        <Link to={APP_LINKS.PRODUCT_CREATE}>
          <CustomButton
            className="add-product-button"
            scaleOnHover={1}
            text="Add Product"
            icon={<BsPlusCircleFill />}
          />
        </Link>
      </header>
      <div className="products-container">
        <div className="filters">
          <Tabs defaultValue={status ? status : "all"} className="w-[400px]">
            <FilterTabsList tabs={tabs} handleTabChange={handleTabChange} />
          </Tabs>

          <InputContainer icon={<TbSearch />} className="search-container">
            <input
              type="text"
              placeholder="Search for product.."
              onChange={handleSearchParamChange}
            />
          </InputContainer>

          <TableBtns
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            page={page}
            totalPages={totalPages}
            nextBtnRef={nextBtnRef}
            prevBtnRef={prevBtnRef}
          />
        </div>

        <div className="table-container">
          <ProductsTable
            isLoading={isLoading}
            error={error}
            products={productsData}
            handleDeleteProduct={handleDeleteProduct}
          />
        </div>

        <footer className="table-footer">
          <select
            defaultValue={limitPerPage}
            onChange={(e) => {
              updatePageParam(1);
              setLimitPerPage(Number(e.target.value));
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <TableBtns
            showPageNumber={true}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            page={page}
            totalPages={totalPages}
          />
        </footer>
      </div>
    </section>
  );
}

function TableSkeleton({ count = 10 }) {
  return Array.from({ length: count }).map((_, i) => (
    <thead key={i}>
      <tr className="p-3">
        <td>
          <div>
            <Skeleton className="w-10 h-10 rounded-full " />
          </div>
        </td>

        {Array.from({ length: 8 }).map((_, j) => (
          <td key={j} className="px-4 py-3 text-gray-200">
            ......
          </td>
        ))}
      </tr>
    </thead>
  ));
}

const FilterTabsList = ({ tabs, handleTabChange }) => {
  return (
    <TabsList>
      {tabs.map(({ value, label, icon, count }) => (
        <TabsTrigger
          key={value}
          value={value}
          onClick={() => handleTabChange(value)}
        >
          <div>
            {icon} <span>{label}</span>
            <Badge>{count}</Badge>
          </div>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

const ProductsTable = ({ isLoading, error, products, handleDeleteProduct }) => {
  let navigate = useNavigate();

  return (
    <Table>
      <TableHead columns={tableHeaders} />
      {isLoading && <TableSkeleton />}
      {!isLoading && error && (
        <NoDataFound
          message="Error loading orders"
          onClick={() => window.location.reload()}
          btnText="Retry"
          className="error"
          columnsCount={tableHeaders.length}
        />
      )}
      {!isLoading && !error && !products && (
        <NoDataFound
          columns={tableHeaders.length}
          message="no Products found"
          columnsCount={tableHeaders.length}
        />
      )}
      {!isLoading && products && (
        <TableBody>
          {products?.map(
            ({
              id,
              imgUrl: productImg,
              name: productName,
              status,
              createdAt: publishedDate,
              category,
              variants,
            }) => {
              const { stock, price } = variants[0] || {};
              const categoryName = category?.name || "Uncategorized";
              const isStockLow = stock < APP_CONFIG.STOCK_LOW_THRESHOLD;
              const newStatus = statusOptions.find(
                (option) => option.value === status
              );
              return (
                <tr className="product-row" key={id}>
                  <td>
                    <img
                      src={productImg}
                      alt={productName}
                      className="product-img"
                    />
                  </td>
                  <td className="name">{productName}</td>
                  <td className="status">
                    <span className={newStatus?.className}>
                      {/* <GoDotFill /> */}
                      {/* {isActive ? <FaRegCircleCheck /> : <FaRegCircleXmark />} */}
                      {newStatus?.label}
                    </span>
                  </td>
                  <td>
                    {isStockLow ? (
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="stock-low">
                              {stock}
                              {isStockLow && (
                                <FaArrowTrendDown color="var(--color-2)" />
                              )}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p
                              style={{
                                color: "var(--color-2)",
                                display: "flex",
                                alignItems: "center",

                                gap: "5px",
                              }}
                            >
                              <CiWarning fontSize={"1rem"} />
                              Stock is low
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      stock
                    )}
                  </td>
                  <td className="price">{formatCurrency(price)}</td>
                  <td>{categoryName}</td>
                  <td className="published">{formatDate(publishedDate)}</td>
                  {handleDeleteProduct && (
                    <td className="action">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <CustomButton
                                aria-label="Edit Product"
                                style={{
                                  ...buttonStyle,
                                  color: "#1131af",
                                }}
                                icon={<MdEditSquare />}
                                onClick={() => {
                                  navigate(APP_LINKS.PRODUCT_UPDATE(id));
                                }}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Product</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <AlertDialog>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger>
                                <CustomButton
                                  aria-label="Delete Product"
                                  style={{
                                    ...buttonStyle,
                                    color: "#ef0012",
                                  }}
                                  icon={<MdDeleteForever />}
                                />
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this product?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the product from your
                              inventory.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <CustomButton
                                className="dialog-button-cancel"
                                text="Cancel"
                                icon={<TbForbid2 />}
                              />
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <CustomButton
                                className="dialog-button-delete"
                                text="Delete"
                                icon={<AiFillDelete />}
                                onClick={() => handleDeleteProduct(id)}
                              />
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  )}
                </tr>
              );
            }
          )}
        </TableBody>
      )}
    </Table>
  );
};
