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
import { Link } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { FaAngleLeft, FaAngleRight, FaRegImage } from "react-icons/fa6";
import axiosInstance from "../../../api/api";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import InputContainer from "../../../components/Forms/InputContainer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tableHeaders = [
  { title: "image", icon: <FaRegImage /> },
  { title: "name", icon: <TbBrandProducthunt /> },
  { title: "Status", icon: <TbHomeSignal /> },
  { title: "Stock", icon: <BiArchiveIn /> },
  { title: "Discount", icon: <HiOutlineReceiptPercent /> },
  // { title: "Orders", icon: <BiBasket /> },
  // { title: "Rating", icon: <CiStar /> },
  { title: "Price", icon: <BiPurchaseTagAlt /> },
  { title: "Category", icon: <TbCategory2 /> },
  { title: "Published", icon: <BiCalendarEdit /> },
  { title: "Action", icon: <TbHandClick /> },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchParam, setSearchParam] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const { data, fetchError, isLoading } = useAxiosFetch(
    `http://localhost:8000/api/products?limit=${ITEMS_PER_PAGE}&page=${currentPage}`
  );

  console.log(data?.products);

  useEffect(() => {
    try {
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setProductsTotal(data.productsCount);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Clear products if error
    }
  }, [data, currentPage]);

  // const filterProducts = useMemo(() => {
  //   return data.filter((product) => product.status);
  // }, [data]);
  const filteredProducts = useMemo(() => {
    switch (selectedTab) {
      case "all":
        return products;
      case "active":
        return products?.filter((product) => product.status === true);
      case "inactive":
        return products?.filter((product) => product.status === false);
      default:
        return products;
    }
  }, [selectedTab, products]);

  const filteredProductsBySearch = useMemo(() => {
    return products?.filter((product) =>
      product.name.toLowerCase().includes(searchParam.toLowerCase())
    );
  }, [products, searchParam]);

  const handleDeleteProduct = async (product) => {
    if (!product.id) {
      toast.error("Please select a product to delete");
      return;
    }
    try {
      await axiosInstance.delete(`/api/products/${product.id}`);
      toast.success("Product Deleted Successfully");
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );
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
      {products && products.length > 0 ? (
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
                    onClick={() => setSelectedTab("all")}
                    value="all"
                  >
                    <div>
                      <CiGrid41 className="icon" /> <span>All</span>
                      <Badge>{productsTotal}</Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setSelectedTab("active")}
                    value="active"
                  >
                    <div>
                      <BsShieldCheck className="icon" /> <span>Active</span>
                      <Badge>14</Badge>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setSelectedTab("inactive")}
                    value="inactive"
                  >
                    <div>
                      <BsShieldX className="icon" />
                      <span>Inactive</span>
                      <Badge>6</Badge>
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
                <div>
                  <LoadingSpinner />
                </div>
              ) : (
                <tbody className="table-body">
                  {!searchParam &&
                    filteredProducts.map((P) => (
                      <ProductRow
                        key={P.id}
                        product={P}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    ))}
                  {filteredProductsBySearch.length > 0 &&
                    searchParam &&
                    filteredProductsBySearch.map((P) => (
                      <ProductRow
                        key={P.id}
                        product={P}
                        handleDeleteProduct={handleDeleteProduct}
                      />
                    ))}
                  {filteredProductsBySearch.length === 0 &&
                    searchParam &&
                    "No products found"}
                </tbody>
              )}
            </table>
            <footer className="table-footer">
              <PreviousBtn
                onClick={handlePreviousPage}
                currentPage={currentPage}
              />
              <span className="page-info">
                {/* Page */}
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
      ) : (
        <NoProductsPage />
      )}
    </section>
  );
}

const PreviousBtn = ({ onClick, currentPage }) => {
  const isFirstPage = currentPage === 1;
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
  const isLastPage = currentPage === totalPages;

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
