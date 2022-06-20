import express from "express";
import { createUserRole } from "../controllers/userRoleController.js";

const userRoute = express.Router();

userRoute.route("/user-role").post(createUserRole);

export default userRoute;
