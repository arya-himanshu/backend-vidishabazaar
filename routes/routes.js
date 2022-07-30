import express from "express";
import categoryRoute from "./businessCategoryRoutes.js";
import { shopRoutes } from "./shopRoutes.js";
import {logInSignUpRoute} from './userLogInSignUpRoutes.js'
import userRoute from "./userRoutes.js";
const router = express.Router();

router.get("/", (request, response) => {
  response.send("Hello");
});

router.use("/shop", shopRoutes);

router.use("/user-auth", logInSignUpRoute);

router.use("/user" , userRoute);

router.use("/business-category" , categoryRoute);

export default router;
