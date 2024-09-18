const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require("../configs/cloudinaryConfig");
const { response } = require("express");

const uploadImageController = async (req, res) => {
  try {
    const { imgUrl, category } = req.body;

    if (!imgUrl || !category) {
      res.status(400).json({ errorMsg: "Image URL or category not correct" });
      return;
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(imgUrl, {
      folder: `/products/${category}`,
      // unique_filename: `product-${new Date().toString()}`,
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      imgUrl: cloudinaryResponse.url,
      response: cloudinaryResponse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ errorMsg: "Internal server error", details: error.message });
  }
};

module.exports = uploadImageController;
