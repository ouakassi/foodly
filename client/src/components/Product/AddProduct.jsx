import Modal from "../Modal";
import Form from "../Forms/Form";
import Button from "../Buttons/Button";

import InputContainer from "../Forms/InputContainer";
import { HiOutlineReceiptPercent } from "react-icons/hi2";

import IMAGES from "../../assets";
import { RiImageAddLine } from "react-icons/ri";
import { MdOutlineAddBox, MdLibraryAddCheck } from "react-icons/md";

import { BiArchiveIn, BiPurchaseTagAlt } from "react-icons/bi";
import { TbBrandProducthunt, TbHomeSignal } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";
import { FaRegCircleCheck, FaRegCircleXmark } from "react-icons/fa6";

import "./AddProduct.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import Dropdown from "../Ui/Dropdown";
import LoadingSpinner from "../Forms/LoadingSpinner";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../api/api";

const options = [
  { label: "Nuts", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" },
];

//  validation schema
let validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  stock: Yup.number().min(1).required("Stock is required"),
  price: Yup.number().min(1),
  status: Yup.boolean(),
});

export default function AddProduct({ onCloseShowAddProduct }) {
  const [selectedProductImage, setSelectedProductImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(true);
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

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await api.post("api/products/", data);
      console.log(response);
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  const handleCategoryDelete = () => {
    setSelectedCategory(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProductImage(reader.result);
        // Set selectedProductImage to the base64 data URI
      };
      reader.readAsDataURL(file); // Convert the selected file to data URL
      setValue("imgUrl", selectedProductImage);
    }
  };

  return (
    <div className="add-product">
      <Modal>
        <div className="product-form-container">
          <button className="close-btn"></button>
          <h2>Create New Product</h2>

          <span style={!selectedStatus ? { opacity: 0.4 } : null}>
            <ProductImage
              className="product-image"
              productName="Product Image"
              productImg={
                !selectedProductImage ? IMAGES.bowl : selectedProductImage
              }
            />
          </span>

          <Form onSubmit={handleSubmit(onSubmit)} className="product-form">
            <input
              type="file"
              name="file"
              id="file"
              className="file-input"
              accept="image/*"
              onChange={handleFileChange}
              {...register("imgUrl")}
            />
            <label
              className={selectedProductImage ? "file-selected" : null}
              htmlFor="file"
            >
              <RiImageAddLine />
              {!selectedProductImage ? (
                <span>Choose an image...</span>
              ) : (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  Image Selected <MdLibraryAddCheck />
                </span>
              )}
            </label>

            <div className="status-toggle">
              <TbHomeSignal style={{ marginLeft: "1rem", fontSize: "2rem" }} />
              <div className="status-buttons-container">
                <motion.span
                  layout
                  className="active-button"
                  style={
                    selectedStatus
                      ? { background: "var(--color-3)", left: 0 }
                      : { background: "#000", left: "50%" }
                  }
                ></motion.span>
                <button
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

            <Dropdown
              options={options}
              selectedItem={selectedCategory}
              onSelect={handleCategorySelect}
              onDelete={handleCategoryDelete}
              defaultLabel="Select Category"
            />

            <div className="button-holders">
              <Button
                isTypeSubmit={true}
                className="submit-button"
                text={"Create"}
                // <span>
                //   <LoadingSpinner />
                // </span>

                icon={<MdOutlineAddBox fontSize="2rem" />}
                // icon={}
              />
              <Button
                className="cancel-button"
                text="Cancel"
                icon={<TiCancel fontSize="2rem" />}
                onClick={onCloseShowAddProduct}
              />
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
