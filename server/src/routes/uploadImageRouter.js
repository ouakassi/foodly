const express = require("express");

const uploadImageController = require("../controllers/uploadImageController");

const uploadImageRouter = express.Router();

uploadImageRouter.route("/").post(uploadImageController);

module.exports = uploadImageRouter;
