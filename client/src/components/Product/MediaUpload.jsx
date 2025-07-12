import "./MediaUpload.css";

import ProductImage from "@/components/Product/ProductImage";
import { motion } from "framer-motion";
import { RiImageAddLine } from "react-icons/ri";
import { MdLibraryAddCheck, MdDeleteForever } from "react-icons/md";
import CustomButton from "@/components/Buttons/CustomButton";
import LoadingSpinner from "@/components/Forms/LoadingSpinner";
import { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";

const MediaUpload = ({
  selectedStatus = true,
  imagePreview,
  handleFileUpload,
  handleRemoveImg,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div className=" media-form">
      <span style={!selectedStatus ? { opacity: 0.4 } : null}>
        <ProductImage
          className="product-image"
          productName="Product Image"
          productImg={imagePreview}
        />
      </span>

      <div className="media-inputs">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              handleFileUpload({ target: { files: [file] } });
            }
          }}
        >
          <input
            type="file"
            name="file"
            id="file"
            className="file-input"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <label
            className={`${imagePreview ? "file-selected" : ""} ${
              isDragging ? "input-on-drag" : ""
            }`}
            htmlFor="file"
          >
            {!imagePreview ? (
              <span>
                <IoMdCloudUpload className="icon" />
                {!isDragging
                  ? "Drop image here or click to upload..."
                  : "drop it now!"}
              </span>
            ) : (
              <span>
                <MdLibraryAddCheck
                  className="icon"
                  style={{ color: "var(--color-3)" }}
                />
                Image Selected!
              </span>
            )}
          </label>
        </div>
        {imagePreview && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          >
            <CustomButton
              text="Remove Image"
              icon={<MdDeleteForever fontSize="1.25rem" />}
              isTypeSubmit={false}
              className="button-save"
              onClick={handleRemoveImg}
              style={{ backgroundColor: "#dc3545" }}
            />
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default MediaUpload;
