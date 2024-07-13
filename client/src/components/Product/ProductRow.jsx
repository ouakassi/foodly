import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { TbEdit, TbTrash } from "react-icons/tb";
import "./ProductRow.css";
import ProductImage from "./ProductImage";

export default function ProductRow({ product }) {
  const {
    imgUrl: productImg,
    name: productName,
    price,
    discount,
    category,
    orders,
    stock,
    rating,
    status,
    createdAt: publishedDate,
  } = product;

  const formatedPrice = new Intl.NumberFormat("en-IN", {
    maximumSignificantDigits: 3,
    style: "currency",
    currency: "USD",
  }).format(+price);

  const isActive = status === true;

  const date = new Date(publishedDate);

  const publishedYear = date.getFullYear();
  const publishedMonth = date.toLocaleString("en", { month: "2-digit" });
  const publishedDay = date.toLocaleString("en", { day: "2-digit" });

  const formattedDiscount = discount.toLocaleString("en", {
    style: "percent",
  });

  console.log(product);

  console.log(formatedPrice);

  return (
    <div className="table-row">
      <div
        className="cell"
        style={!isActive ? { opacity: 0.5 } : { opacity: 1 }}
      >
        <ProductImage
          productImg={productImg}
          productName={productName}
          className=" product-img"
        />
      </div>

      <div className="cell name">{productName}</div>
      <div className="cell status">
        <span className={isActive ? "active" : "inactive"}>
          {isActive ? <FaRegCircleCheck /> : <FaRegCircleXmark />}
          {isActive ? "active" : "inactive"}
        </span>
      </div>
      <div className="cell stock">{stock}</div>
      <div className="cell discount">
        {/* <BiTrendingDown /> */}
        {formattedDiscount}
      </div>
      <div className="cell category">{category}</div>
      <div className="cell orders">
        {/* <BiBasket /> */}
        {orders}
      </div>
      <div className="cell rating">
        {/* <CiStar /> */}
        {rating}
      </div>
      <div className="cell published">
        {/* <BiCalendarEdit /> */}
        {`${publishedDay}-${publishedMonth}-${publishedYear}`}
      </div>
      <div className="cell price">
        {/* <BiPurchaseTagAlt /> */}
        {formatedPrice}
      </div>
      <div className="cell action">
        <TbEdit />
        <TbTrash />
      </div>
    </div>
  );
}
