const express = require("express");

const {
  getAllAddresses,
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

const addressRouter = express.Router();

addressRouter
  .route("/:userId/addresses/")
  .get(getAddresses)
  .post(createAddress);

addressRouter
  .route("/:userId/addresses/:addressId")
  .get(getAddress)
  .put(updateAddress)
  .delete(deleteAddress);

module.exports = addressRouter;
