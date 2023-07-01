import express from "express";
import { createLabourProfile, getAllLabour } from "../controllers/dailyWageLabourController.js";
const dailyWageLabourRoutes = express.Router();
import { auth } from "../middleware/auth.js";

dailyWageLabourRoutes.route("/create-account").post(auth, createLabourProfile);

dailyWageLabourRoutes.route("/get-all-labours").get(auth, getAllLabour);

export { dailyWageLabourRoutes };
