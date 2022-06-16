import express from "express";
import * as userSignUp from "../controllers/userSignUpController.js";
import * as userSignIp from "../controllers/userSignInController.js";

const logInSignUpRoute = express.Router();

logInSignUpRoute.route("/user-login").post(userSignIp.userLogIn);

logInSignUpRoute.route("/user-signup").post(userSignUp.userSignUp);

logInSignUpRoute.route("/mobile-varification").post(userSignUp.mobileOptValidation);

export { logInSignUpRoute };
