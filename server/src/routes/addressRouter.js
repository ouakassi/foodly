import express from "express";

import {
  getAllAddresses,
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

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

export default addressRouter;
