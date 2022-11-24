import express from "express";
import { customerInteractionData, getShopsImpressionDataByOwnerId } from "../controllers/customerInteractionDataController.js";
const customerInteractionDataRoutes = express.Router();
import { auth } from "../middleware/auth.js";

customerInteractionDataRoutes.route("/publish-metrics").post(customerInteractionData);
customerInteractionDataRoutes.route("/get-shop-metrics-by-owner/:userId").get(auth, getShopsImpressionDataByOwnerId);

export { customerInteractionDataRoutes };
