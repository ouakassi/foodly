import "./CreateProductPage.css";
import CustomButton from "@/components/Buttons/CustomButton";
import InputContainer from "@/components/Forms/InputContainer";
import ProductImage from "@/components/Product/ProductImage";

import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";

import {
  MdOutlineAddBox,
  MdLibraryAddCheck,
  MdOutlineUploadFile,
} from "react-icons/md";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";
import { TbHomeSignal, TbBrandProducthunt } from "react-icons/tb";
import { BiArchiveIn, BiPurchaseTagAlt } from "react-icons/bi";
import { AiOutlineDollar, AiOutlinePercentage } from "react-icons/ai";
import { RiAddCircleLine, RiImageAddLine } from "react-icons/ri";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axiosInstance from "../../../api/api";

//  validation schema
let validationSchema = Yup.object({
  status: Yup.boolean().default(true),
  name: Yup.string()
    .matches(
      /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
      "Name can only contain Latin letters."
    )
    .typeError("name must be a `string` type")
    .required("Name is required"),
  stock: Yup.number()
    .min(1, "Stock can't be 0")
    .default(1)
    .required("Stock is required"),
  price: Yup.number("Enter a valid number")
    .required("price is required")
    .min(1, "Price can't be less than 0")
    .default(0),
  discount: Yup.number()
    .max(100, "Discount can't be more than 100%")
    .min(0, "Discount can't be less than 0%")
    .default(0)
    .typeError("Discount must be a `number` type")
    .nullable(),
});

export default function CreateProductPage() {
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    console.log(file.size);
    if (file?.size > 1000000) {
      alert("file is big");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!imagePreview) return;
    try {
      const res = await axiosInstance.post("/api/upload", {
        imgUrl: imagePreview,
        category: "nuts",
      });
      setProductImage(res.data.imgUrl);
      console.log(res.data.imgUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // console.log(data.imgUrl);
      const response = await axiosInstance.post("api/products/", {
        ...data,
        imgUrl: productImage,
      });
      console.log(response);
      console.log(getValues);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("nothing");
      }
    }
  };

  return (
    <div className="create-product">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="create-header">
          <h1>create product</h1>
          <div>
            <CustomButton
              text="save as draft"
              icon={<MdOutlineUploadFile fontSize="1.25rem" />}
              isTypeSubmit={true}
              className="button-save"
            />
            <CustomButton
              text="Create"
              icon={<MdOutlineAddBox fontSize="1.25rem" />}
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
                    style={
                      selectedStatus
                        ? { background: "black", left: 0 }
                        : { background: "rgb(109 109 109)", left: "50%" }
                    }
                  ></motion.span>
                  <button
                    id="#status"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedStatus(true);
                      setValue("status", true);
                    }}
                    style={
                      selectedStatus ? { color: "var(--white-color)" } : null
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
                      !selectedStatus ? { color: "var(--white-color)" } : null
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
                <input type="text" {...register("name")} />
              </InputContainer>
              <div className="row">
                <InputContainer
                  labelText="Stock"
                  icon={<BiArchiveIn />}
                  errorMsg={errors?.stock?.message}
                >
                  <input type="number" {...register("stock")} />
                </InputContainer>
                <InputContainer
                  errorMsg={errors?.price?.message}
                  labelText="Price"
                  icon={<AiOutlineDollar />}
                >
                  <input type="number" {...register("price")} />
                </InputContainer>
                <InputContainer
                  errorMsg={errors?.discount?.message}
                  labelText="Discount"
                  icon={<AiOutlinePercentage />}
                >
                  <input
                    type="number"
                    {...register("discount")}
                    // min={0}
                    max={100}
                    maxlength={3}
                    required
                  />
                </InputContainer>
              </div>
            </div>
            <div className="content-container category-form ">
              <header>
                <h3>category</h3>
                <button>
                  <RiAddCircleLine /> add category
                </button>
              </header>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="content-container media-form">
            <h3>Media upload</h3>
            <span style={!selectedStatus ? { opacity: 0.4 } : null}>
              <ProductImage
                className="product-image"
                productName="Product Image"
                productImg={imagePreview}
              />
            </span>
            <div>
              <input
                type="file"
                name="file"
                id="file"
                className="file-input"
                accept="image/*"
                onChange={handleFileUpload}
                // {...register("imgUrl")}
              />
              <label
                className={imagePreview ? "file-selected" : null}
                htmlFor="file"
              >
                <RiImageAddLine />
                {!imagePreview ? (
                  <span>Upload image...</span>
                ) : (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--gap-1)",
                    }}
                  >
                    Image Selected <MdLibraryAddCheck />
                  </span>
                )}
              </label>
              <CustomButton onClick={handleUploadImage} text="upload image" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
