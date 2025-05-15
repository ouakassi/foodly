import CustomButton from "@/components/Buttons/CustomButton";
import ProductHeader from "@/components/Product/ProductHeader";
import ProductRow from "@/components/Product/ProductRow";
import Header from "@/components/Product/Header";
import "./ProductsPage.css";
import NoProductsPage from "./NoProductsPage";

import { BsPlusCircleFill, BsShieldCheck, BsShieldX } from "react-icons/bs";
import {
  BiArchiveIn,
  BiBasket,
  BiPurchaseTagAlt,
  BiCalendarEdit,
  BiSolidErrorCircle,
} from "react-icons/bi";
import { CiGrid41, CiStar } from "react-icons/ci";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

import {
  TbHandClick,
  TbCategory2,
  TbHomeSignal,
  TbBrandProducthunt,
  TbSearch,
} from "react-icons/tb";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { FaAngleLeft, FaAngleRight, FaRegImage } from "react-icons/fa6";
import axiosInstance from "../../../api/api";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import InputContainer from "../../../components/Forms/InputContainer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDebounce from "../../../hooks/useDebounce";
import { use } from "react";

const tableHeaders = [
  { title: "Image", icon: <FaRegImage /> },
  {
    title: "Name",
    icon: <TbBrandProducthunt />,
    isSortable: true,
    value: "name_asc",
  },
  { title: "Status", icon: <TbHomeSignal /> },
  {
    title: "Stock",
    icon: <BiArchiveIn />,
    isSortable: true,
    value: "stock_asc",
  },
  {
    title: "Price",
    icon: <BiPurchaseTagAlt />,
    isSortable: true,
    value: "price_asc",
  },
  { title: "Category", icon: <TbCategory2 /> },
  { title: "Discount", icon: <HiOutlineReceiptPercent /> },
  {
    title: "Published",
    icon: <BiCalendarEdit />,
    isSortable: true,
    value: "createdAt_asc",
  },
  { title: "Action", icon: <TbHandClick /> },
  // { title: "Orders", icon: <BiBasket /> },
  // { title: "Rating", icon: <CiStar /> },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0 || 0);
  const [limitPerPage, setLimitPerPage] = useState(10);
  // const ITEMS_PER_PAGE = 10;

  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

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

  const { data, isLoading, fetchError, refetch } = useAxiosFetch(
    "http://localhost:8000/api/products",
    params
  );

  const {
    activeProducts: activeProductsCount = 0,
    inactiveProducts: inactiveProductsCount = 0,
  } = data || {};

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
      count: productsTotal || 0,
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
  ];
  useEffect(() => {
    let lastPressTime = 0;
    const handleKeyPress = (e) => {
      const now = Date.now();

      // If less than 250ms seconds since last valid press, skip
      if (now - lastPressTime < 250) return;

      if (e.key === "ArrowLeft") {
        prevBtnRef.current?.click();
        console.log("Prev button clicked");
      } else if (e.key === "ArrowRight") {
        nextBtnRef.current?.click();
        console.log("Next button clicked");
      }
      lastPressTime = now;
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [nextBtnRef, prevBtnRef]);

  useEffect(() => {
    if (!data) {
      setProducts([]);
      updatePageParam(1);
      setTotalPages(1);
      setProductsTotal(0);
      return;
    }

    try {
      const { productsData = [], totalPages = 1, totalProducts = 0 } = data;

      setProducts(productsData);
      setTotalPages(totalPages);
      setProductsTotal(totalProducts);
    } catch (error) {
      console.error("Error processing data:", error);
      setProducts([]); // fallback in case something goes wrong
    }
  }, [data]);

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

  const handleDeleteProduct = async (product) => {
    if (!product.id) {
      toast.error("Please select a product to delete");
      return;
    }
    try {
      await axiosInstance.delete(`/api/products/${product.id}`);
      toast.success("Product Deleted Successfully");

      const updatedProducts = products.filter((p) => p.id !== product.id);

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

    setCurrentPage(1);

    const newParams = new URLSearchParams(searchParams);

    // ✅ remove search param if empty
    if (value.trim() === "") {
      newParams.delete("search");
    } else {
      newParams.set("search", value);
    }

    // newParams.set("page", "1");
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
    <section className="products-page">
      {products && (
        <>
          <header>
            <h1>Products</h1>

            <Link to={"create"}>
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
              <Tabs defaultValue="all" className="w-[400px]">
                <FilterTabsList tabs={tabs} handleTabChange={handleTabChange} />
              </Tabs>

              <InputContainer icon={<TbSearch />} className="search-container">
                <input
                  type="text"
                  placeholder="Search for product.."
                  onChange={handleSearchParamChange}
                />
              </InputContainer>

              <div className="table-pages-buttons">
                <PreviousBtn onClick={handlePreviousPage} page={page} />

                <NextBtn
                  onClick={handleNextPage}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            </div>

            <table className="table">
              <ProductHeader headers={tableHeaders} />
              {isLoading ? (
                <TableSkeleton count={limitPerPage} />
              ) : (
                <tbody className="table-body">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="100%" className="text-center">
                        <BiSolidErrorCircle style={{ color: "red" }} />
                        No Product found!
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>

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
              <PreviousBtn
                onClick={handlePreviousPage}
                page={page}
                prevBtnRef={prevBtnRef}
              />
              <span className="page-info">
                <span className="page-current">{page}</span>/
                <span className="total-pages">{totalPages}</span>
              </span>

              <NextBtn
                onClick={handleNextPage}
                page={page}
                totalPages={totalPages}
                nextBtnRef={nextBtnRef}
              />
            </footer>
          </div>
        </>
      )}
      {/* <NoProductsPage /> */}
    </section>
  );
}

const PreviousBtn = ({ onClick, page, prevBtnRef }) => {
  const isFirstPage = page <= 1;
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span onClick={onClick} ref={prevBtnRef}>
            <CustomButton disabled={isFirstPage} icon={<FaAngleLeft />} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isFirstPage ? "Previous Page" : "You're in first page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const NextBtn = ({ onClick, page, totalPages, nextBtnRef }) => {
  const isLastPage = page >= totalPages;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span ref={nextBtnRef} onClick={onClick}>
            <CustomButton
              disabled={isLastPage}
              icon={<FaAngleRight />}
              aria-label="Next Page"
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isLastPage ? "Next Page" : "Already in Last page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Badge = ({ children }) => <span className="badge">{children}</span>;

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
