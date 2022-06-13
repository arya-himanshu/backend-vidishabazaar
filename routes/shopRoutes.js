import express from "express";
import { shopRegistration } from "../controllers/shopRegistrationController.js";

const shopRoutes = express.Router();

shopRoutes.route("/").get((req, res) => {
  res.send(
    '<h1 style="text-align:center;color:red;">A shop is loading.</h1>'
  );
});
shopRoutes.route("/shop-registration").get(shopRegistration);

export { shopRoutes };
