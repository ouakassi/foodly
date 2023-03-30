const express = require("express");
const { getAllAddresses } = require("../controllers/addressController");

const adminRouter = express.Router();

adminRouter.get("/users/addresses", getAllAddresses);

module.exports = adminRouter;
