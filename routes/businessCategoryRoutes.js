import express from "express";
import * as category from "../controllers/categoryController.js";
const categoryRoute = express.Router();
categoryRoute.route("/create-category").post(category.createCategory);
categoryRoute.route("/business-categories").get(category.getAllBusinessCategory);

export default categoryRoute;
