import express from "express";

import uploadImageController from "../controllers/uploadImageController.js";

const uploadImageRouter = express.Router();

uploadImageRouter.route("/").post(uploadImageController);

export default uploadImageRouter;
