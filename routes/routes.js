import express from "express";
import { shopRegistration } from "../controllers/shop-registration-controller.js";
import { userRegistration } from "../controllers/user-registration-controller.js";

const router = express.Router();

router.get("/", (request, response) => {
  response.send("Hello");
});

router.get("/shop_registration", shopRegistration);

router.get("/user_registration", userRegistration);

export default router;
