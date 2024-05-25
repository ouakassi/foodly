import "./ProductsPage.css";
import Button from "../../../components/Buttons/Button";
import ProductHeader from "../../../components/Product/ProductHeader";
import ProductRow from "../../../components/Product/ProductRow";
import Header from "../../../components/Product/Header";

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
import { useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import CreateProduct from "../../../components/Product/CreateProduct";
import NoProductsFound from "../../../components/Product/NoProductsFound";

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
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const handleShowCreateProduct = () => {
    setShowCreateProduct(true);
  };
  const handleHideCreateProduct = () => setShowCreateProduct(false);

  const {
    data: products,
    fetchError,
    isLoading,
  } = useAxiosFetch("http://localhost:8000/api/products");

  console.log(products);
  console.log(fetchError);

  return (
    <>
      {showCreateProduct && (
        <CreateProduct onCloseShowCreateProduct={handleHideCreateProduct} />
      )}
      {products ? (
        <section className="products__page">
          <Header
            title="all products"
            button={
              <Button
                className="add__product-button"
                scaleOnHover={1}
                text="add Product"
                icon={<BsPlusCircleFill />}
                onClick={() => setShowCreateProduct(true)}
              />
            }
          />
          <div className="table ">
            <div className="table__filters"></div>
            <ProductHeader headers={tableHeaders} />
            <div className="table__body">
              {products.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="products__page">
          <NoProductsFound onSetShowCreateProduct={handleShowCreateProduct} />
        </section>
      )}
    </>
  );
}
