import "./CreateProductPage.css";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, get } from "react-hook-form";
import { motion } from "framer-motion";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import CustomButton from "@/components/Buttons/CustomButton";
import InputContainer from "@/components/Forms/InputContainer";
import LoadingSpinner from "../../../components/Forms/LoadingSpinner";
import MediaUpload from "../../../components/Product/MediaUpload";
import CategoryForm from "../../../components/Product/CategoryForm";
import ContentContainer from "../../../components/Dashboard/ContentContainer";
import PageTitle from "../../../components/Dashboard/PageTitle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";

import { MdDelete, MdOutlineDownloading } from "react-icons/md";
import {
  FaFileCirclePlus,
  FaRegCircleCheck,
  FaRegCircleXmark,
} from "react-icons/fa6";
import { FaFileSignature } from "react-icons/fa";
import { BiCheck, BiPlus } from "react-icons/bi";

import { axiosInstance, API_URL } from "@/api/api";
import { createProductValidationSchema } from "../../../../utils/validation";
import { API_ENDPOINTS, APP_LINKS } from "../../../constants";
import { RiAddCircleLine, RiDraftLine } from "react-icons/ri";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import ErrorMsg from "../../../components/Errors/ErrorMsg";
import { generateSlug } from "../../../lib/helpers";
import { axiosPrivate } from "../../../api/api";

const statuses = [
  { value: "active", icon: <FaRegCircleCheck /> },
  { value: "draft", icon: <RiDraftLine /> },
  { value: "inactive", icon: <FaRegCircleXmark /> },
];

const defaultVariant = { name: "", sku: "", price: "", stock: "" };

export default function CreateProductPage(defaultValues = {}) {
  const {
    id: editId,
    createdAt,
    updatedAt,
    ...editDefaultValues
  } = defaultValues.defaultValues || {};
  const isEditSession = Boolean(editId);

  const [selectedStatus, setSelectedStatus] = useState(
    isEditSession ? editDefaultValues.status : "active"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    isEditSession ? editDefaultValues.category.name : ""
  );

  const [imagePreview, setImagePreview] = useState(
    isEditSession ? editDefaultValues.imgUrl : ""
  );
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createProductValidationSchema),
    mode: "onChange",
    defaultValues: !isEditSession
      ? {
          name: "",
          slug: "",
          category: selectedCategory || "",
          status: selectedStatus,
          imgUrl: "",
          // images: [],
          description: "",
          variants: [defaultVariant],
        }
      : { ...editDefaultValues, category: editDefaultValues.category.name },
  });

  let navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
    keyName: "_id",
  });

  console.log(getValues());
  console.log("editDefaultValues", editDefaultValues);
  console.log(selectedCategory);

  const {
    data,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useAxiosFetch(`${API_URL}${API_ENDPOINTS.CATEGORIES}`);

  const categories = data?.data.categories || [];

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleOpennCategoryDialog = (e) => {
    e.preventDefault();
    setOpenCategoryDialog(true);
  };

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

  const handleCategoryInputChange = (value) => {
    refetchCategories();
    setValue("category", value);
    setSelectedCategory(value);

    // setValue("category", value);
  };

  const handleProductSlugGeneration = (e) => {
    e.preventDefault();

    const name = getValues("name");
    if (name) {
      const slug = generateSlug(name);
      setValue("slug", slug);
      toast.success(`Slug generated: ${slug}`);
    } else {
      toast.error("Please enter a product name first");
    }
  };

  const handleDeleteVariant = (e, index) => {
    e.preventDefault();
    if (fields.length === 1) {
      toast.warning("At least one variant is required");
      return;
    }
    remove(index);
  };

  const onSubmit = async (data) => {
    console.log(data);
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

      const imgRes = await axiosInstance.post(
        API_ENDPOINTS.PRODUCT_UPLOAD_IMAGE,
        {
          imgUrl: imagePreview,
          category: selectedCategory || "nuts", // Default to "nuts" if no category is selected
        }
      );

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

      await axiosPrivate.post(API_ENDPOINTS.PRODUCT_CREATE, {
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
        <section className="create-product-section">
          <div>
            <ContentContainer className={"product-form"} title={"product data"}>
              <div className="status-buttons-container">
                <motion.span
                  className={`active-button ${selectedStatus}`}
                  layout
                  transition={{ duration: 0.25 }}
                />
                {statuses.map((status, i) => (
                  <button
                    key={status.value}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedStatus(status.value);
                      setValue("status", status.value);
                    }}
                    className={
                      selectedStatus === status.value ? "is-active" : ""
                    }
                  >
                    {status.icon} {status.value}
                  </button>
                ))}
                <input
                  type="hidden"
                  {...register("status")}
                  value={selectedStatus}
                />
              </div>
              <InputContainer
                isFieldRequired={true}
                labelText="name"
                // icon={<TbBrandProducthunt />}
                errorMsg={errors?.name?.message}
              >
                <input
                  type="text"
                  {...register("name", { required: true, maxLength: 25 })}
                />
              </InputContainer>
              <InputContainer labelText="slug" errorMsg={errors?.slug?.message}>
                <input
                  type="text"
                  {...register("slug", { required: false, maxLength: 25 })}
                />
                <CustomButton
                  className="btn slug-btn"
                  text="generate slug"
                  icon={<MdOutlineDownloading fontSize={"1.4rem"} />}
                  onClick={handleProductSlugGeneration}
                />
              </InputContainer>
            </ContentContainer>
            <ContentContainer className={"category-form"} title={"category"}>
              <button
                className="category-form__trigger-btn"
                onClick={(e) => {
                  handleOpennCategoryDialog(e);
                }}
              >
                <RiAddCircleLine /> Add Category
              </button>
              <Select
                key={selectedCategory} // reset when value changes
                value={selectedCategory}
                onValueChange={handleCategoryInputChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent>
                  {isCategoriesLoading && (
                    <SelectItem disabled value="loading">
                      Loading...
                    </SelectItem>
                  )}

                  {!isCategoriesLoading && categoriesError && (
                    <SelectItem disabled value="error">
                      Failed to load categories
                    </SelectItem>
                  )}

                  {!isCategoriesLoading &&
                    !categoriesError &&
                    categories.length === 0 && (
                      <SelectItem disabled value="no-data">
                        No categories available
                      </SelectItem>
                    )}

                  {!isCategoriesLoading &&
                    !categoriesError &&
                    categories.length > 0 &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>

                <ErrorMsg errorMsg={errors?.category?.message} />
              </Select>
            </ContentContainer>
          </div>
          <ContentContainer className={"media-form"} title={"media upload"}>
            <MediaUpload
              selectedStatus={selectedStatus}
              imagePreview={imagePreview}
              handleFileUpload={handleFileUpload}
              handleRemoveImg={handleRemoveImg}
            />
          </ContentContainer>
        </section>
        <ContentContainer className="product-variants" title="product variants">
          {fields.map((field, index) => (
            <ProductVariant
              key={field.id}
              field={field}
              index={index}
              onDeleteVariant={handleDeleteVariant}
              register={register}
              errors={errors}
            />
          ))}

          {/* Global “add new variant” button */}
          <CustomButton
            className="btn new-variant-btn"
            text="new product variant"
            icon={<BiPlus fontSize="1.25rem" />}
            onClick={(e) => {
              e.preventDefault();
              append(defaultVariant);
            }}
          />
        </ContentContainer>
      </form>

      <CategoryForm
        openCategoryDialog={openCategoryDialog}
        onSetOpenCategoryDialog={setOpenCategoryDialog}
        handleCategoryInputChange={handleCategoryInputChange}
      />

      {isFormLoading && (
        <div className="loader-container">
          <div className="form-loader">
            <LoadingSpinner style={{ width: "2rem", height: "2rem" }} />
            {isEditSession ? "Editing product..." : "Creating product..."}
          </div>
        </div>
      )}
    </div>
  );
}

const ProductVariant = ({ index, onDeleteVariant, register, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      layout
      className="row"
    >
      <div className="product-variant-inputs">
        <InputContainer
          labelText="variant name"
          errorMsg={errors?.variants?.[index]?.name?.message}
        >
          <input
            type="text"
            {...register(`variants.${index}.name`, {
              required: "Variant name is required",
              maxLength: 25,
            })}
          />
        </InputContainer>

        <InputContainer
          labelText="SKU"
          errorMsg={errors?.variants?.[index]?.sku?.message}
        >
          <input
            type="text"
            {...register(`variants.${index}.sku`, {
              required: "SKU is required",
              maxLength: 25,
            })}
          />
        </InputContainer>

        <InputContainer
          labelText="Price"
          errorMsg={errors?.variants?.[index]?.price?.message}
        >
          <input
            type="number"
            step="0.01"
            {...register(`variants.${index}.price`, {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
            })}
          />
        </InputContainer>

        <InputContainer
          labelText="Stock"
          errorMsg={errors?.variants?.[index]?.stock?.message}
        >
          <input
            type="number"
            {...register(`variants.${index}.stock`, {
              required: "Stock is required",
              valueAsNumber: true,
              min: { value: 1, message: "Min stock = 1" },
            })}
          />
        </InputContainer>
      </div>

      <div className="product-variant-btns">
        {/* You can turn this into a save/update action if needed */}
        {/* <CustomButton
          className="btn add-variant-btn"
          icon={<BiCheck fontSize="1.25rem" />}
          onClick={(e) => {
            e.preventDefault();
            toast.success("Variant saved successfully");
          }}
        /> */}

        <CustomButton
          className="btn remove-variant-btn"
          icon={<MdDelete fontSize="1.25rem" />}
          onClick={(e) => onDeleteVariant(e, index)}
        />
      </div>
    </motion.div>
  );
};
