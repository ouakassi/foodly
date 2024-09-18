import "./ProductRow.css";
import ProductImage from "./ProductImage";
import CustomButton from "../Buttons/CustomButton";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { MdDeleteForever, MdEditSquare } from "react-icons/md";

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
import {
  FaArrowTrendDown,
  FaRegCircleCheck,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { color } from "framer-motion";
import { AiFillDelete } from "react-icons/ai";
import { TbForbid2 } from "react-icons/tb";

const buttonStyle = {
  color: "white",
  borderRadius: "10px",
  padding: "5px 10px",
  maxWidth: "max-content",
  fontSize: "var(--fs-l)",
  boxShadow: "none",
  cursor: "pointer", // Ensure the button shows the pointer cursor
};

export default function ProductRow({ product, handleDeleteProduct }) {
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

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // Ensures at least 2 decimal places are shown
    maximumFractionDigits: 20, // Allows up to 20 decimal places (you can adjust as needed)
  }).format(+price);

  const isActive = status === true;

  const date = new Date(publishedDate);
  const publishedYear = date.getFullYear();
  const publishedMonth = date.toLocaleString("en", { month: "2-digit" });
  const publishedDay = date.toLocaleString("en", { day: "2-digit" });

  const formattedDiscount = discount.toLocaleString("en", {
    style: "percent",
  });

  return (
    <tr>
      <td style={!isActive ? { opacity: 0.8 } : { opacity: 1 }}>
        <ProductImage
          productImg={productImg}
          productName={productName}
          className="product-img"
        />
      </td>
      <td className="status">
        <span className={isActive ? "active" : "inactive"}>
          {isActive ? <FaRegCircleCheck /> : <FaRegCircleXmark />}
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="name">{productName}</td>
      <td>
        {stock}
        {stock <= 25 && <FaArrowTrendDown color="var(--color-2)" />}
      </td>
      <td>{formattedDiscount}</td>
      {/* <td>{orders}</td> */}
      {/* <td>{rating}</td> */}
      <td className="price">{formattedPrice}</td>
      <td>{category}</td>
      <td className="published">{`${publishedDay}-${publishedMonth}-${publishedYear}`}</td>
      <td className="action">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CustomButton
                aria-label="Edit Product"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#5300b5",
                }}
                icon={<MdEditSquare />}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Product</p>
            </TooltipContent>
          </Tooltip>
          {/* </TooltipProvider>

        <TooltipProvider> */}
          <Tooltip>
            <TooltipTrigger>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <CustomButton
                    aria-label="Delete Product"
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#ef0012",
                    }}
                    icon={<MdDeleteForever />}
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this product?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      product from your inventory.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <CustomButton
                        className="dialog-button-cancel"
                        text="cancel"
                        icon={<TbForbid2 />}
                      />
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <CustomButton
                        className="dialog-button-delete "
                        text="Delete"
                        icon={<AiFillDelete />}
                        onClick={() => handleDeleteProduct(product)}
                      />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </tr>
  );
}
