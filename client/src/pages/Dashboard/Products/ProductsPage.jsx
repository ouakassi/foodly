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
import { useEffect, useMemo, useState } from "react";
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
  const [selectedTab, setSelectedTab] = useState("all");
  // const [sortedBy, setSortedBy] = useState(
  //   searchParams.get("sort") || "name_asc"
  // );
  const [searchParam, setSearchParam] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const debouncedSearch = useDebounce(searchParam, 500); // 500ms delay

  const [searchParams] = useSearchParams();

  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "name_asc";
  const status = searchParams.get("status");

  console.log({ page, limit, search, sort, status });

  const sortMap = {
    name_asc: "name_asc",
    name_desc: "name_desc",
    price_asc: "price_asc",
    price_desc: "price_desc",
    createdAt_asc: "createdAt_asc",
    createdAt_desc: "createdAt_desc",
    updatedAt_asc: "updatedAt_asc",
    updatedAt_desc: "updatedAt_desc",
  };

  const params = {
    ...(searchParam && { search: debouncedSearch }),
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    ...(selectedTab !== "all" && { status: selectedTab }),
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

  useEffect(() => {
    try {
      setProducts(data.productsData);
      setTotalPages(data.totalPages);
      setProductsTotal(data.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Clear products if error
    }
  }, [data, currentPage]);

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
      if (updatedProducts.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        refetch();
      }
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSearchParamChange = (e) => {
    setSearchParam(e.target.value);
    console.log(e.target.value);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) {
      toast.error("You are already on the last page");
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage === 1) {
      toast.error("You are already on the first page");
      return;
    }
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <section className="products-page">
      {products && (
        <>
          <header>
            <h1>Products</h1>

            <Link to={"../create"}>
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
                <TabsList>
                  <TabsTrigger
                    onClick={() => {
                      setCurrentPage(1), setSelectedTab("all");
                    }}
                    value="all"
                  >
                    <div>
                      <CiGrid41 className="icon" /> <span>All</span>
                      <Badge>{productsTotal ? productsTotal : 0}</Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {
                      setCurrentPage(1), setSelectedTab("active");
                    }}
                    value="active"
                  >
                    <div>
                      <BsShieldCheck className="icon" /> <span>Active</span>
                      <Badge>{activeProductsCount}</Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => {
                      setCurrentPage(1), setSelectedTab("inactive");
                    }}
                    value="inactive"
                  >
                    <div>
                      <BsShieldX className="icon" />
                      <span>Inactive</span>
                      <Badge>{inactiveProductsCount}</Badge>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <InputContainer icon={<TbSearch />} className="search-container">
                <input
                  type="text"
                  placeholder="Search for product.."
                  onChange={handleSearchParamChange}
                />
              </InputContainer>

              <div className="table-pages-buttons">
                <PreviousBtn
                  onClick={handlePreviousPage}
                  currentPage={currentPage}
                />

                <NextBtn
                  onClick={handleNextPage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            </div>

            <table className="table">
              <ProductHeader headers={tableHeaders} />
              {isLoading ? (
                <TableSkeleton count={ITEMS_PER_PAGE} />
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
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>

            <footer className="table-footer">
              <PreviousBtn
                onClick={handlePreviousPage}
                currentPage={currentPage}
              />
              <span className="page-info">
                <span className="page-current">{currentPage}</span>/
                <span className="total-pages">{totalPages}</span>
              </span>

              <NextBtn
                onClick={handleNextPage}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </footer>
          </div>
        </>
      )}
      {/* <NoProductsPage /> */}
    </section>
  );
}

const PreviousBtn = ({ onClick, currentPage }) => {
  const isFirstPage = currentPage <= 1;
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <CustomButton
              onClick={onClick}
              disabled={isFirstPage}
              icon={<FaAngleLeft />}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{!isFirstPage ? "Previous Page" : "You're in first page"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const NextBtn = ({ onClick, currentPage, totalPages }) => {
  const isLastPage = currentPage >= totalPages;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <CustomButton
              onClick={onClick}
              disabled={isLastPage}
              icon={<FaAngleRight />}
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
  return (
    <div className="rounded-md border w-full">
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="text-sm flex items-center justify-between">
          <td className="px-4 py-3">
            <Skeleton className="h-10 w-10 rounded-full" />
          </td>

          {Array.from({ length: 8 }).map((_, i) => (
            <td className="px-4 py-3 text-gray-200">......</td>
          ))}
        </tr>
      ))}
    </div>
  );
}
