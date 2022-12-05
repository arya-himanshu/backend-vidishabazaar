import express from "express";
import { addHomeBannerAds, getHomeBannerAds } from "../controllers/bazarAdsController.js";
import { auth } from "../middleware/auth.js";

const bazarAdsRoutes = express.Router();

bazarAdsRoutes.route("/get-home-banner").get(getHomeBannerAds);

bazarAdsRoutes.route("/add-home-banner").post(auth, addHomeBannerAds);

export default bazarAdsRoutes;
