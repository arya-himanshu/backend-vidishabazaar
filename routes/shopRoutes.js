import express from "express";
import * as shopCategory from "../controllers/shopCategoryController.js";
import * as shopController from "../controllers/shopCRUDController.js";
import { addShopProductController } from "../controllers/addShopProductController.js";
import { auth } from "../middleware/auth.js";
const shopRoutes = express.Router();

shopRoutes.route("/shop-category").post(auth, shopCategory.shopCategory);
shopRoutes.route("/shop-categories").get(auth, shopCategory.getAllShopCategory);
shopRoutes.route("/shop-category/:id").get(auth, shopCategory.getCategoryById);
shopRoutes.route("/update-shop-category/:id").put(auth, shopCategory.updateCategorybyId);
shopRoutes.route("/delete-shop-category/:id").delete(auth, shopCategory.deleteCategoryById);
shopRoutes.route("/shop-registration").post(auth, shopController.creatingShop);
shopRoutes.route("/shops").get(shopController.getAllShops);
shopRoutes.route("/add-shop-product").post(auth, addShopProductController);
shopRoutes.route("/get-shops-with-name").get(shopController.getShopsWithName);
shopRoutes.route("/get-shop-with-id/:id").get(shopController.getShopWithId);
shopRoutes.route("/get-shops-with-user-id/:userId").get(shopController.getShospWithUserId);
shopRoutes.route("/delete-shop/:id").delete(auth, shopController.deleteShopById);
shopRoutes.route("/update-shop").post(auth, shopController.updateShop);

export { shopRoutes };
