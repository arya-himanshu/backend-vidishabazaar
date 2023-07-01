import express from "express";
import bazarAdsRoutes from "./bazarAdsRoutes.js";
import categoryRoute from "./businessCategoryRoutes.js";
import { customerInteractionDataRoutes } from "./customerInteractionDataRoute.js";
import languageTranslateRoute from "./languageTranslate.js";
import recentActivityRoutes from "./recentActivityRoutes.js";
import { searchEngineRoutes } from "./searchEngineRoutes.js";
import { shopRoutes } from "./shopRoutes.js";
import { logInSignUpRoute } from "./userLogInSignUpRoutes.js";
import userRoute from "./userRoutes.js";
const router = express.Router();
import mongoose from "mongoose";
import { dailyWageLabourRoutes } from "./dailyWageLabourRoute.js";

const { connection } = mongoose;

router.get("/", (request, response) => {
  response.send("Hello");
});

router.use("/shop", shopRoutes);

router.use("/user-auth", logInSignUpRoute);

router.use("/user", userRoute);

router.use("/business-category", categoryRoute);

router.use("/search-engine", searchEngineRoutes);

router.use("/language-translate", languageTranslateRoute);

router.use("/c-i-d", customerInteractionDataRoutes);

router.use("/recent-activity", recentActivityRoutes);

router.use("/bazar-ads", bazarAdsRoutes);

router.use("/daily-wage-labour", dailyWageLabourRoutes);

export default router;
