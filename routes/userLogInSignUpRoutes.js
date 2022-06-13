import express from "express";
import * as userAuth from "../controllers/userAuthenticationController.js";

const logInSignUpRoute = express.Router();

logInSignUpRoute.route("/user-login").get(userAuth.userLogIn);

logInSignUpRoute.route("/user-signup").post(userAuth.userSignUp);

logInSignUpRoute.route("/mobile-varification").post(userAuth.mobileOptValidation);

export { logInSignUpRoute };
