import express from "express";
import { createTranslateString, getAllTranslateStrings } from "../controllers/translateStringController.js";
import { auth } from "../middleware/auth.js";
const languageTranslateRoute = express.Router();
languageTranslateRoute.route("/create-translate-string").post(auth, createTranslateString);
languageTranslateRoute.route("/get-translated-strings").get(getAllTranslateStrings);

export default languageTranslateRoute;
