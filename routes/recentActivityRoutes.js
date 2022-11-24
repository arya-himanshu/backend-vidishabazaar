import express from "express";
import { getRecentActivities } from "../controllers/recentActivityController.js";

const recentActivityRoutes = express.Router();

recentActivityRoutes.route("/recent-activity/:cookieId").get(getRecentActivities);

export default recentActivityRoutes;
