import express from "express";
import * as userSignUp from "../controllers/userSignUpController.js";
import * as userSignIp from "../controllers/userSignInController.js";
import { iotpd } from "../controllers/otpHistoryController.js";
import { auth } from "../middleware/auth.js";

const logInSignUpRoute = express.Router();

logInSignUpRoute.route("/user-login").post(userSignIp.userLogIn);

logInSignUpRoute.route("/user-signup").post(userSignUp.userSignUp);

logInSignUpRoute.route("/mobile-varification").post(userSignUp.mobileOptValidation);

logInSignUpRoute.route("/signin-resend-otp").post(userSignIp.resendSignInOtp);

logInSignUpRoute.route("/update-user-token").get(userSignIp.deleteUserTokenOnLogOut);

logInSignUpRoute.route("/change-password").post(auth,userSignIp.userChangePassword);

logInSignUpRoute.route("/change-password-otp").get(auth,userSignIp.changePasswordOTP);

logInSignUpRoute.route("/forgot-password").post(userSignIp.forgotPassword);

logInSignUpRoute.route("/sotph").post(auth,iotpd);


export { logInSignUpRoute };
