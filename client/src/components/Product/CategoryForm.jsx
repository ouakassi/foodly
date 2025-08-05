import "./CategoryForm.css";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";

import CustomButton from "@/components/Buttons/CustomButton";

import InputContainer from "../Forms/InputContainer";
import LoadingSpinner from "../Forms/LoadingSpinner";

import { MdFormatListBulletedAdd, MdOutlineDownloading } from "react-icons/md";

import { API_ENDPOINTS } from "../../constants";
import { API_URL, axiosInstance } from "../../api/api";
import { createCategoryValidationSchema } from "../../../utils/validation";
import { generateSlug } from "../../lib/helpers";

const CategoryForm = ({
  openCategoryDialog,
  onSetOpenCategoryDialog,
  handleCategoryInputChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    setValue,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(createCategoryValidationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  // Focus on the first input when the dialog opens
  useEffect(() => {
    if (openCategoryDialog) {
      setFocus("name");
      reset({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [openCategoryDialog, setFocus, reset]);

  const handleCategorySlugGeneration = (e) => {
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

  const createCategory = async (data) => {
    console.log(data);
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES, {
        name: data.name,
        slug: data.slug,
        description: data.description,
      });
      handleCategoryInputChange(data.name);
      if (response.status === 201) {
        reset();
        // Call the parent function to refresh categories or show a success message
        onSetOpenCategoryDialog(false);
        toast.success("Category created successfully!");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create category"
      );
      // Handle error (e.g., show notification)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="category-form">
      {/* Create New Category Dialog */}
      <Dialog open={openCategoryDialog} onOpenChange={onSetOpenCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle className="font-extrabold">
            Create New Category
          </DialogTitle>

          <DialogDescription>
            Create a new category to better organize your products.
          </DialogDescription>
          <form onSubmit={handleSubmit(createCategory)}>
            <div className="category-inputs">
              <InputContainer
                errorMsg={errors?.name?.message}
                labelText="Category Name"
                isFieldRequired={true}
              >
                <input
                  {...register("name")}
                  className="category-form__input"
                  type="text"
                />
              </InputContainer>
              <InputContainer
                errorMsg={errors?.slug?.message}
                labelText="Category Slug"
                isFieldRequired={true}
                // style={{ marginTop: "0.5rem" }}
              >
                <input
                  {...register("slug")}
                  className="category-form__input"
                  type="text"
                />
                <CustomButton
                  className="btn slug-btn"
                  text="generate slug"
                  icon={<MdOutlineDownloading fontSize={"1.4rem"} />}
                  onClick={handleCategorySlugGeneration}
                />
              </InputContainer>
              <InputContainer
                errorMsg={errors?.description?.message}
                labelText="Category Description"
                isFieldRequired={false}
                // style={{ marginTop: "0.5rem" }}
              >
                <textarea
                  {...register("description")}
                  style={{ width: "100%", padding: "0.5rem" }}
                  cols={10}
                  rows={10}
                  name=""
                  id=""
                  placeholder="Enter category description here..."
                ></textarea>
              </InputContainer>
            </div>
            <DialogFooter>
              <CustomButton
                icon={
                  isLoading ? (
                    <LoadingSpinner
                      style={{
                        height: "1rem",
                        width: "1rem",
                        borderBottomColor: "white",
                      }}
                    />
                  ) : (
                    <MdFormatListBulletedAdd fontSize="1.4rem" />
                  )
                }
                text="Add Category"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryForm;
