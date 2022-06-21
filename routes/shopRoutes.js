import express from "express";
import * as shopCategory from "../controllers/shopCategoryController.js";
import { auth } from "../middleware/auth.js";
const shopRoutes = express.Router();

shopRoutes.route("/").get(auth, (req, res) => {
  res.send('<h1 style="text-align:center;color:red;">A shop is loading.</h1>');
});
shopRoutes.route("/shop-category").post(shopCategory.shopCategory);
shopRoutes.route("/shop-category").get(shopCategory.getAllShopCategory);
shopRoutes.route("/shop-category/:id").get(shopCategory.getCategoryById);
shopRoutes.route("/update-shop-category/:id").put(shopCategory.updateCategorybyId);

export { shopRoutes };
