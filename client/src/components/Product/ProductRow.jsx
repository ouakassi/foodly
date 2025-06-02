import "./ProductRow.css";
import ProductImage from "./ProductImage";
import CustomButton from "../Buttons/CustomButton";
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
import { AiFillDelete } from "react-icons/ai";
import { TbForbid2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CiWarning } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { formatCurrency, formatDate } from "../../lib/helpers";

const buttonStyle = {
  color: "white",
  borderRadius: "10px",
  padding: "2px 5px",
  maxWidth: "max-content",
  fontSize: "var(--fs-l)",
  boxShadow: "none",
  cursor: "pointer",
  backgroundColor: "white",
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

  const navigate = useNavigate();

  const isActive = status === true;
  const isStockLow = stock <= 30;

  return (
    <tr className="product-row">
      <td style={!isActive ? { opacity: 0.8 } : { opacity: 1 }}>
        <img src={productImg} alt={productName} className="product-img" />
      </td>
      <td className="name">{productName}</td>
      <td className="status">
        <span className={isActive ? "active" : "inactive"}>
          <GoDotFill />
          {/* {isActive ? <FaRegCircleCheck /> : <FaRegCircleXmark />} */}
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>
        {isStockLow ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                {stock}
                {isStockLow && <FaArrowTrendDown color="var(--color-2)" />}
              </TooltipTrigger>
              <TooltipContent>
                <p
                  style={{
                    color: "var(--color-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <CiWarning fontSize={"1.2rem"} />
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
      <td>{category}</td>
      <td>{`${discount}%`}</td>
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
                      color: "var(--color-3)",
                    }}
                    icon={<MdEditSquare />}
                    onClick={() => {
                      navigate(`/dashboard/products/edit/${product.id}`);
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
                  This action cannot be undone. This will permanently delete the
                  product from your inventory.
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
                    onClick={() => handleDeleteProduct(product)}
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
