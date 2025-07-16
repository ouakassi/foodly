import "./CreateProductPage.css";
import CustomButton from "@/components/Buttons/CustomButton";
import InputContainer from "@/components/Forms/InputContainer";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";

import { MdOutlineUploadFile } from "react-icons/md";

import {
  FaFileCirclePlus,
  FaRegCircleCheck,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { TbHomeSignal, TbBrandProducthunt } from "react-icons/tb";
import { BiArchiveIn } from "react-icons/bi";
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";

import { axiosInstance, API_URL } from "@/api/api";
import { toast } from "sonner";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../../components/Product/MediaUpload";
import CategoryForm from "../../../components/Product/CategoryForm";
import ContentContainer from "../../../components/Dashboard/ContentContainer";
import { createProductValidationSchema } from "../../../../utils/validation";
import PageTitle from "../../../components/Dashboard/PageTitle";
import { FaFileSignature } from "react-icons/fa";
import { API_ENDPOINTS, APP_LINKS } from "../../../constants";

export default function CreateProductPage(defaultValues = {}) {
  const {
    id: editId,
    createdAt,
    updatedAt,
    ...editDefaultValues
  } = defaultValues.defaultValues || {};
  const isEditSession = Boolean(editId);

  const [selectedStatus, setSelectedStatus] = useState(
    isEditSession ? editDefaultValues.status : true
  );
  const [categories, setCategories] = useState([
    "oils",
    "nuts",
    "coffees",
    "herbs",
  ]);
  const [imagePreview, setImagePreview] = useState(
    isEditSession ? editDefaultValues.imgUrl : ""
  );
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    isEditSession ? editDefaultValues.category : "nuts"
  );
  const [newCategory, setNewCategory] = useState("");
  const [isAddCategoryLoading, setIsAddCategoryLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createProductValidationSchema),
    mode: "onChange",
    defaultValues: !isEditSession
      ? {
          stock: 1,
          discount: 0,
          category: "nuts",
        }
      : editDefaultValues,
  });

  let navigate = useNavigate();
  // const formattedDiscount = getValues().discount.toLocaleString("en", {
  //   style: "percent",
  // });

  useEffect(() => {
    setFocus("name");
  }, []);

  useEffect(() => {
    setValue("category", selectedCategory);
  }, [selectedCategory, setValue]);
  // const {
  //   data: products,
  //   fetchError,
  //   isLoading,
  //   error,
  // } = useAxiosFetch(API_URL + API_ENDPOINTS.PRODUCTS);
  // useEffect(() => {
  //   if (error) {
  //     console.error("Error fetching products:", error);
  //     toast.error("Failed to fetch products. Please try again.");
  //     return;
  //   }
  //   if (!products) {
  //     console.log("no categories found");
  //     return;
  //   }
  //   if (products.length > 0) {
  //     const uniqueCategories = [
  //       ...new Set(products.map((product) => product.category)),
  //     ];
  //     setCategories(uniqueCategories);
  //   }
  // }, [error, products]);

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
    // setProductImageUrl(null);
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();

    const trimmedCategory = newCategory.trim().toLowerCase();

    if (/[A-Z0-9]/.test(newCategory)) {
      toast.error("Cannot contain uppercase letters or numbers.");
      return;
    }

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
      setSelectedCategory(trimmedCategory);
      setValue("category", trimmedCategory);

      // Clear input
      setNewCategory("");

      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again.");
    } finally {
      setOpenCategoryDialog(false);
      setIsAddCategoryLoading(false);
    }
  };

  const handleCategoryInputChange = (value) => {
    setSelectedCategory(value);
    setValue("category", value);
  };

  const onSubmit = async (data) => {
    // Ensure image is selected
    if (!imagePreview) {
      toast.warning("Select an image, please!");
      return;
    }

    if (!data.category) {
      toast.warning("Select a category, please!");
      return;
    }

    try {
      setIsFormLoading(true);

      const imgRes = await axiosInstance.post("/api/upload", {
        imgUrl: imagePreview,
        category: selectedCategory || "nuts", // Default to "nuts" if no category is selected
      });

      const uploadedImgUrl = imgRes.data.imgUrl;

      setValue("imgUrl", uploadedImgUrl);

      // Ensure that the image URL is part of the data
      data.imgUrl = uploadedImgUrl;

      if (isEditSession) {
        await axiosInstance.put(API_ENDPOINTS.PRODUCT_UPDATE(editId), {
          ...data,
        });
        console.log("edit data", data);
        toast.success("Product edited successfully");
        navigate("/dashboard/products");
        return;
      }

      await axiosInstance.post(API_ENDPOINTS.PRODUCT_CREATE, {
        ...data,
      });

      console.log("create data", data);
      toast.success("Product created successfully");
      navigate(APP_LINKS.PRODUCTS);
      return;
    } catch (error) {
      console.error("Error saving the product", error);
      toast.error("Failed to save product");
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <div className="create-product">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!isEditSession ? (
          <div className="create-header">
            <PageTitle title="create product" icon={<FaFileCirclePlus />} />
            <div>
              <CustomButton
                text="save product"
                icon={<FaFileCirclePlus fontSize="1.25rem" />}
                isTypeSubmit={true}
              />
            </div>
          </div>
        ) : (
          <div className="create-header">
            <PageTitle title="edit product" icon={<FaFileSignature />} />

            <div>
              <CustomButton
                text="save edit"
                icon={<FaFileSignature fontSize="1.25rem" />}
                isTypeSubmit={true}
                disabled={isFormLoading}
              />
            </div>
          </div>
        )}

        <div>
          <ContentContainer className={"media-form"} title={"media upload"}>
            <MediaUpload
              selectedStatus={selectedStatus}
              imagePreview={imagePreview}
              handleFileUpload={handleFileUpload}
              handleRemoveImg={handleRemoveImg}
            />
          </ContentContainer>
          <div className="row">
            <ContentContainer className={"product-form"} title={"product"}>
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
                    className={`active-button ${
                      selectedStatus ? "active" : "inactive"
                    }`}
                    style={selectedStatus ? { left: 0 } : { left: "50%" }}
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
                        ? {
                            color: "#ffbbbb",
                            textShadow: "1px 1px #00000099",
                          }
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
                  />
                </InputContainer>
                {/* <span>{formattedDiscount}</span> */}
              </div>
            </ContentContainer>

            <ContentContainer className={"category-form"} title={"category"}>
              <CategoryForm
                selectedCategory={selectedCategory}
                categories={categories}
                newCategory={newCategory}
                isAddCategoryLoading={isAddCategoryLoading}
                handleAddNewCategory={handleAddNewCategory}
                setNewCategory={setNewCategory}
                setValue={setValue}
                handleCategoryInputChange={handleCategoryInputChange}
                onSetOpenCategoryDialog={setOpenCategoryDialog}
                openCategoryDialog={openCategoryDialog}
                isEditSession={isEditSession}
                editDefaultValues={editDefaultValues}
              />
            </ContentContainer>
          </div>
        </div>
      </form>
      {isFormLoading && (
        <div className="loader-container">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
