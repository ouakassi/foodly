import CustomButton from "@/components/Buttons/CustomButton";
import ProductHeader from "@/components/Product/ProductHeader";
import ProductRow from "@/components/Product/ProductRow";
import Header from "@/components/Product/Header";
import "./ProductsPage.css";
import NoProductsPage from "./NoProductsPage";

import { BsPlusCircleFill } from "react-icons/bs";
import {
  BiArchiveIn,
  BiBasket,
  BiPurchaseTagAlt,
  BiCalendarEdit,
} from "react-icons/bi";
import { CiStar } from "react-icons/ci";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

import {
  TbHandClick,
  TbCategory2,
  TbHomeSignal,
  TbBrandProducthunt,
} from "react-icons/tb";
import { Link } from "react-router-dom";
import useAxiosFetch from "../../../hooks/useAxiosFetch";

const tableHeaders = [
  { title: "" },
  { title: "Product", icon: <TbBrandProducthunt /> },
  { title: "Status", icon: <TbHomeSignal /> },
  { title: "Stock", icon: <BiArchiveIn /> },
  { title: "Discount", icon: <HiOutlineReceiptPercent /> },
  { title: "Category", icon: <TbCategory2 /> },
  { title: "Orders", icon: <BiBasket /> },
  { title: "Rating", icon: <CiStar /> },
  { title: "Published", icon: <BiCalendarEdit /> },
  { title: "Price", icon: <BiPurchaseTagAlt /> },
  { title: "Action", icon: <TbHandClick /> },
];

export default function ProductsPage() {
  const {
    data: products,
    fetchError,
    isLoading,
  } = useAxiosFetch("http://localhost:8000/api/products");

  return products ? (
    <section className="products-page">
      <Header
        title="all products"
        button={
          <Link to={"../create"}>
            <CustomButton
              className="add-product-button"
              scaleOnHover={1}
              text="add Product"
              icon={<BsPlusCircleFill />}
            />
          </Link>
        }
      />
      <div className="table ">
        <div className="table-filters"></div>
        <ProductHeader headers={tableHeaders} />
        <div className="table-body">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  ) : (
    <section className="products-page">
      <NoProductsPage />
    </section>
  );
}
