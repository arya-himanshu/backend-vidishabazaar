import express from "express";
import * as shopCategory from "../controllers/shopCategoryController.js";
import * as shopRegistration from "../controllers/shopCRUDController.js";
import  addShopProductController from "../controllers/addShopProductController.js";
import { auth } from "../middleware/auth.js";
const shopRoutes = express.Router();

shopRoutes.route("/shop-category").post(auth, shopCategory.shopCategory);
shopRoutes.route("/shop-categories").get(auth, shopCategory.getAllShopCategory);
shopRoutes.route("/shop-category/:id").get(auth, shopCategory.getCategoryById);
shopRoutes.route("/update-shop-category/:id").put(auth, shopCategory.updateCategorybyId);
shopRoutes.route("/delete-shop-category/:id").delete(auth, shopCategory.deleteCategoryById);
shopRoutes.route("/shop-registration").post(auth, shopRegistration.creatingShop);
shopRoutes.route("/shops").get(shopRegistration.getAllShops);
shopRoutes.route("/:id/add-shop-product").post(addShopProductController);

export { shopRoutes };
