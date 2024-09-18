// import "./EditProductPage.css";
import CustomButton from "@/components/Buttons/CustomButton";
import InputContainer from "@/components/Forms/InputContainer";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { MdOutlineUploadFile } from "react-icons/md";

import {
  FaFileCirclePlus,
  FaRegCircleCheck,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { TbHomeSignal, TbBrandProducthunt } from "react-icons/tb";
import { BiArchiveIn } from "react-icons/bi";
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";

import axiosInstance from "../../../api/api";
import { toast } from "sonner";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../../components/Product/MediaUpload";
import CategoryForm from "../../../components/Product/CategoryForm";

//  validation schema (same as create)
let validationSchema = Yup.object({
  status: Yup.boolean().default(true),
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Name can only contain Latin letters."
    )
    .required("Name is required"),
  stock: Yup.number()
    .integer("Stock must be a whole number")
    .min(1, "must be at least 1")
    .required("Stock is required"),
  price: Yup.number()
    .positive("must be a positive number")
    .min(1, "can't be less than 0")
    .required("price is required"),
  discount: Yup.number()
    .min(0, "can't be less than 0%")
    .max(100, "can't be more than 100%")
    .nullable(),
  category: Yup.string().matches(
    /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
    "Name can only contain Latin letters."
  ),
});

const activeStyles = {
  backgroundColor: "13c93d",
  background: `linear-gradient(3deg, rgb(2, 0, 36) 0%, var(--color-3) 0%, rgb(0 255 129) 100%)`,
  boxShadow: `rgba(0, 255, 89, 0.09) 0px 2px 1px,
                rgba(0, 255, 89, 0.09) 0px 4px 2px,
                rgba(0, 255, 89, 0.09) 0px 8px 4px,
                `,
  left: 0,
};

const inactiveStyles = {
  backgroundColor: "#dc3545",
  background: `linear-gradient(3deg, rgb(36, 0, 2) 0%, rgb(201, 19, 19) 0%, rgb(255, 0, 0) 100%)`,

  boxShadow: `rgba(255, 0, 0, 0.09) 0px 2px 1px,
                rgba(255, 0, 0, 0.09) 0px 4px 2px,
                rgba(255, 0, 0, 0.09) 0px 8px 4px,
             `,
  left: "50%",
};

export default function EditProductPage() {
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [productImageUrl, setProductImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isImgUploadLoading, setIsImgUploadLoading] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categories, setCategories] = useState([
    "oils",
    "nuts",
    "coffees",
    "herbs",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddCategoryLoading, setIsAddCategoryLoading] = useState(false);
  const [isProductFormLoading, setIsProductFormLoading] = useState(false);
  const { productId } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState({});

  const {
    data: productsData,
    fetchError,
    isLoading,
  } = useAxiosFetch("http://localhost:8000/api/products/");

  console.log(product);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    // defaultValues: async () => {
    //   const product = await axiosInstance.get(
    //     `http://localhost:8000/api/products/${productId}`
    //   );
    //   return product.data;
    // },

    // defaultValues: {
    //   status: true,
    //   name: "",
    //   stock: 1,
    //   price: 0,
    //   imgUrl: "",
    //   discount: 0,
    //   category: "",
    // },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    if (file.size > 1000000) {
      toast.error("Image size exceeds 1MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImg = (e) => {
    e.preventDefault();
    setImagePreview("");
    setProductImageUrl(null);
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();

    const trimmedCategory = newCategory.trim().toLowerCase();

    if (!trimmedCategory) {
      toast.error("Category cannot be empty");
      return;
    }
    if (categories.some((category) => category === trimmedCategory)) {
      toast.error("Same category exists");
      return;
    }
    if (trimmedCategory.length <= 2) {
      toast.error("Can't be less than 2 letters");
      return;
    }
    try {
      setIsAddCategoryLoading(true);
      setCategories((prevCategories) => [trimmedCategory, ...prevCategories]);
      setNewCategory("");
      setOpenCategoryDialog(false);

      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setIsAddCategoryLoading(false);
    }
  };

  const handleCategoryInputChange = (value) => {
    setValue("category", value);
  };

  const onSubmit = async (data) => {
    if (!imagePreview) {
      toast.warning("Select an image, please!");
      return;
    }

    if (!data.category) {
      toast.warning("Select a category, please!");
      return;
    }
    try {
      setIsImgUploadLoading(true);
      setIsProductFormLoading(true);

      // Update product information
      const response = await axiosInstance.put(`/api/products/${productId}`, {
        ...data,
        imgUrl: productImageUrl, // Ensure you're using the updated or original image URL
      });

      toast.success("Product updated successfully");
      navigate("/dashboard/products");
    } catch (err) {
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsImgUploadLoading(false);
      setIsProductFormLoading(false);
    }
  };

  return (
    <div className="edit-product">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="create-header">
          <h1>Edit product</h1>
          <div>
            {/* <CustomButton
              text="save as draft"
              icon={<MdOutlineUploadFile fontSize="1.25rem" />}
              isTypeSubmit={true}
              className="button-save"
            /> */}
            <CustomButton
              text="Edit"
              icon={<FaFileCirclePlus fontSize="1.25rem" />}
              isTypeSubmit={true}
            />
          </div>
        </div>
        <div className="row">
          <div>
            <div className="content-container product-form">
              <h3>product</h3>
              <div className="status-toggle">
                <div className="flex">
                  <TbHomeSignal
                    style={{ marginRight: "0.5rem", fontSize: "1.25rem" }}
                  />
                  <label htmlFor="#status">Status:</label>
                </div>
                <div className="status-buttons-container">
                  <motion.span
                    layout
                    className="active-button"
                    style={selectedStatus ? activeStyles : inactiveStyles}
                  ></motion.span>

                  <button
                    id="#status"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedStatus(true);
                      setValue("status", true);
                    }}
                    style={
                      selectedStatus
                        ? { color: "#fff", textShadow: "1px 1px #00000099" }
                        : null
                    }
                  >
                    <FaRegCircleCheck />
                    Active
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedStatus(false);
                      setValue("status", false);
                    }}
                    style={
                      !selectedStatus
                        ? { color: "#ffbbbb", textShadow: "1px 1px #00000099" }
                        : null
                    }
                  >
                    <FaRegCircleXmark />
                    Inactive
                  </button>
                </div>
                <input
                  type="hidden"
                  {...register("status")} // Register 'status' field
                  value={selectedStatus}
                />
              </div>
              <InputContainer
                labelText="name"
                icon={<TbBrandProducthunt />}
                errorMsg={errors?.name?.message}
              >
                <input
                  type="text"
                  {...register("name", { required: true, maxLength: 25 })}
                />
              </InputContainer>
              <div className="row">
                <InputContainer
                  labelText="Stock"
                  icon={<BiArchiveIn />}
                  errorMsg={errors?.stock?.message}
                >
                  <input
                    type="number"
                    {...register("stock", {
                      required: "Stock is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Stock must be at least 1",
                      },
                    })}
                    defaultValue={1}
                  />
                </InputContainer>

                <InputContainer
                  errorMsg={errors?.price?.message}
                  labelText="Price"
                  icon={<AiOutlineDollar />}
                >
                  <input
                    type="number"
                    step="0.01"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price cannot be negative",
                      },
                    })}
                  />
                </InputContainer>

                <InputContainer
                  errorMsg={errors?.discount?.message}
                  labelText="Discount"
                  icon={<AiOutlinePercentage />}
                >
                  <input
                    type="number"
                    {...register("discount", {
                      required: "Discount is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Discount cannot be negative",
                      },
                      max: {
                        value: 100,
                        message: "Discount cannot exceed 100%",
                      },
                    })}
                    defaultValue={0}
                  />
                </InputContainer>
              </div>
            </div>
            <CategoryForm
              categories={categories}
              newCategory={newCategory}
              isAddCategoryLoading={isAddCategoryLoading}
              handleAddNewCategory={handleAddNewCategory}
              setNewCategory={setNewCategory}
              setValue={setValue}
              handleCategoryInputChange={handleCategoryInputChange}
              onSetOpenCategoryDialog={setOpenCategoryDialog}
              openCategoryDialog={openCategoryDialog}
            />
          </div>

          <MediaUpload
            selectedStatus={selectedStatus}
            imagePreview={imagePreview}
            isImgUploadLoading={isImgUploadLoading}
            isProductFormLoading={isProductFormLoading}
            handleFileUpload={handleFileUpload}
            handleRemoveImg={handleRemoveImg}
          />
        </div>
      </form>
      {isImgUploadLoading && isProductFormLoading && (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
