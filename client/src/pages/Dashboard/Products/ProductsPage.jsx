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
import { FaRegImage } from "react-icons/fa6";
import axiosInstance from "../../../api/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";

// const PRODUCTS = [
//   {
//     id: 1,
//     status: true,
//     name: "Mixed Nuts",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 499,
//     stock: 250,
//     discount: 10.0,
//     category: "Fruits",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 2,
//     status: false,
//     name: "Dried Mango Slices",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 425,
//     stock: 300,
//     discount: 8.5,
//     category: "Oils",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 3,
//     status: true,
//     name: "Dried Plums",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 555.68,
//     stock: 500,
//     discount: 5.5,
//     category: "Coffees",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 4,
//     status: false,
//     name: "Roasted Peanuts",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 350,
//     stock: 400,
//     discount: 7.0,
//     category: "Herbs",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 5,
//     status: true,
//     name: "Chestnuts",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 675,
//     stock: 150,
//     discount: 6.0,
//     category: "Fruits",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 6,
//     status: false,
//     name: "Dried Figs",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 475,
//     stock: 220,
//     discount: 4.5,
//     category: "Oils",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 7,
//     status: true,
//     name: "Bay Leaves",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 299,
//     stock: 350,
//     discount: 5.0,
//     category: "Herbs",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 8,
//     status: false,
//     name: "Dried Rose Petals",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 399,
//     stock: 180,
//     discount: 6.5,
//     category: "Coffees",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 9,
//     status: true,
//     name: "Dried Rose Blend",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 450,
//     stock: 270,
//     discount: 9.0,
//     category: "Fruits",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
//   {
//     id: 10,
//     status: false,
//     name: "Ground Cinnamon",
//     imgUrl:
//       "https://res.cloudinary.com/djfsxp9z0/image/upload/v1726090749/products/nuts/cedfb7a667584a1362a6b25ef127eeea.png",
//     price: 299,
//     stock: 320,
//     discount: 4.0,
//     category: "Oils",
//     createdAt: "2024-09-12T10:00:00Z",
//   },
// ];

const tableHeaders = [
  { title: "image", icon: <FaRegImage /> },
  { title: "Status", icon: <TbHomeSignal /> },
  { title: "name", icon: <TbBrandProducthunt /> },
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
  const {
    data: productsData,
    fetchError,
    isLoading,
  } = useAxiosFetch("http://localhost:8000/api/products");

  useEffect(() => {
    productsData && setProducts(productsData);
  }, [productsData]);

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

  return (
    <section className="products-page">
      <header>
        <h1>All Products</h1>
        <Link to={"../create"}>
          <CustomButton
            className="add-product-button"
            scaleOnHover={1}
            text="Add Product"
            icon={<BsPlusCircleFill />}
          />
        </Link>
      </header>
      {isLoading ? (
        <div>
          {" "}
          <LoadingSpinner />
        </div>
      ) : (
        <div className="products-container">
          {products && products.length > 0 ? (
            <table className="table">
              <ProductHeader headers={tableHeaders} />
              <tbody className="table-body">
                {products.map((P) => (
                  <ProductRow
                    key={P.id}
                    product={P}
                    handleDeleteProduct={handleDeleteProduct}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <NoProductsPage />
          )}
        </div>
      )}
    </section>
  );
}
