import ProductImage from "@/components/Product/ProductImage";
import { motion } from "framer-motion";
import { RiImageAddLine } from "react-icons/ri";
import { MdLibraryAddCheck, MdDeleteForever } from "react-icons/md";
import CustomButton from "@/components/Buttons/CustomButton";
import LoadingSpinner from "@/components/Forms/LoadingSpinner";

const MediaUpload = ({
  selectedStatus = true,
  imagePreview,
  handleFileUpload,
  handleRemoveImg,
}) => {
  return (
    <div className="content-container media-form">
      <h3>Media upload</h3>
      <span style={!selectedStatus ? { opacity: 0.4 } : null}>
        <ProductImage
          className="product-image"
          productName="Product Image"
          productImg={imagePreview}
        />
      </span>

      <div className="media-inputs">
        <input
          type="file"
          name="file"
          id="file"
          className="file-input"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <label className={imagePreview ? "file-selected" : null} htmlFor="file">
          {!imagePreview ? (
            <span>
              <RiImageAddLine className="icon" />
              Select an image...
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
