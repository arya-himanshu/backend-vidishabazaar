import express from "express";
import { shopRoutes } from "./shopRoutes.js";
import {logInSignUpRoute} from './userLogInSignUpRoutes.js'
import userRoute from "./userRoutes.js";
const router = express.Router();

router.get("/", (request, response) => {
  response.send("Hello");
});

router.use("/shop", shopRoutes);

router.use("/user-auth", logInSignUpRoute);

router.use("/user" , userRoute)

export default router;
