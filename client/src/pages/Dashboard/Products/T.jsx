import Form from "@/components/Forms/Form";

import InputContainer from "@/components/Forms/InputContainer";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

import { RiImageAddLine } from "react-icons/ri";
import { MdOutlineAddBox, MdLibraryAddCheck } from "react-icons/md";

import { BiArchiveIn, BiPurchaseTagAlt } from "react-icons/bi";
import { TbBrandProducthunt, TbHomeSignal } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

import "./CreateProductPage.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductImage from "@/components/Product/ProductImage";
import Dropdown from "@/components/ui/Dropdown";
import LoadingSpinner from "@/components/Forms/LoadingSpinner";
// import { Button } from "@/components/ui/button";
import CustomButton from "@/components/Buttons/CustomButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import api from "../../api/api";

export default function CreateProductPage() {
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(true);

  const [cloudName] = useState("djfsxp9z0");

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
  });




  // const imageUpload = async (file) => {
  //   const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "docs_upload_example_us_preset");

  //   let data = "";

  //   await Axios.post(url, formData).then((response) => {
  //     data = response.data["secure_url"];
  //   });

  //   return data;
  // };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  const handleCategoryDelete = () => {
    setSelectedCategory(null);
  };


  return (
    <div className="add-product">
      <div className="product-form-container">
        <h2 className="font-bold">Create New Product</h2>
      

        <Form onSubmit={handleSubmit(onSubmit)} className="product-form">
          <InputContainer
            errorMsg={errors.name?.message}
            labelText="Name"
            icon={<TbBrandProducthunt />}
          >
            <input type="text" {...register("name")} />
          </InputContainer>

          <div className="input-holders">
            <InputContainer labelText="Stock" icon={<BiArchiveIn />}>
              <input type="number" {...register("stock")} />
            </InputContainer>
            <InputContainer labelText="Price" icon={<BiPurchaseTagAlt />}>
              <input type="number" {...register("price")} />
            </InputContainer>
            <InputContainer
              labelText="Discount"
              icon={<HiOutlineReceiptPercent />}
            >
              <input type="number" {...register("discount")} />
            </InputContainer>
          </div>

          {/* <Dropdown
              options={options}
              selectedItem={selectedCategory}
              onSelect={handleCategorySelect}
              onDelete={handleCategoryDelete}
              defaultLabel="Select Category"
            /> */}

          <div className="button-holders">
            <CustomButton
              isTypeSubmit={true}
              className="submit-button"
              text={"Create"}
              // <span>
              //   <LoadingSpinner />
              // </span>

              icon={<MdOutlineAddBox fontSize="1.25rem" />}
              // icon={}
            />
            <CustomButton
              className="cancel-button"
              text="Cancel"
              icon={<TiCancel fontSize="1.25rem" />}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
