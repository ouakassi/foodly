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

const buttonStyle = {
  color: "white",
  borderRadius: "10px",
  padding: "5px 10px",
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

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2, // Ensures at least 2 decimal places are shown
    maximumFractionDigits: 20, // Allows up to 20 decimal places (you can adjust as needed)
  }).format(+price);

  const isActive = status === true;
  const isStockLow = stock <= 25;

  const date = new Date(publishedDate);
  const publishedYear = date.getFullYear();
  const publishedMonth = date.toLocaleString("en", { month: "short" });
  const publishedDay = date.toLocaleString("en", { day: "2-digit" });

  return (
    <tr>
      <td style={!isActive ? { opacity: 0.8 } : { opacity: 1 }}>
        <ProductImage
          productImg={productImg}
          productName={productName}
          className="product-img"
        />
      </td>
      <td className="name">{productName}</td>
      <td className="status">
        <span className={isActive ? "active" : "inactive"}>
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
                  Warning: Stock is low
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          stock
        )}
      </td>
      <td className="price">{formattedPrice}</td>
      <td>{category}</td>
      <td>{`${discount}%`}</td>
      <td className="published">{`${publishedMonth} ${publishedDay}  ${publishedYear}`}</td>
      <td className="action">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <CustomButton
                aria-label="Edit Product"
                style={{
                  ...buttonStyle,
                  color: "#2300b5",
                }}
                icon={<MdEditSquare />}
                onClick={() => {
                  navigate(`/dashboard/products/edit/${product.id}`);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <CustomButton
                    aria-label="Delete Product"
                    style={{
                      ...buttonStyle,
                      color: "#ef0012",
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
