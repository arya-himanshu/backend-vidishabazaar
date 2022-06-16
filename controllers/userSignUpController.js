import { VidishaBazaarUser } from "../models/userModel.js";
import ApiError from "../error/ApiError.js";
import { getUserByMobileNumber, getUserById } from "../services/userService.js";
const userSignUp = async (request, response, next) => {
  const { name, dob, mobile, email, password, confirm_password, role_id } = request.body;

  if (!name) {
    return next(ApiError.badRequest({ errorMsg: "First Name is required" }));
  }

  if (!dob) {
    return next(ApiError.badRequest({ errorMsg: "Date of birth is required" }));
  }

  if (!mobile) {
    return next(ApiError.badRequest({ errorMsg: "Mobile Name is required" }));
  } else if (mobile && mobile.length != 10) {
    return next(ApiError.badRequest({ errorMsg: "Mobile number be in 10 digits" }));
  }

  if (password && confirm_password && password !== confirm_password) {
    return next(ApiError.unauthorizedServerError({ errorMsg: "Password and confirm password is not match" }));
  } else if (!password) {
    return next(ApiError.badRequest({ errorMsg: "Password Name is required" }));
  } else if (!confirm_password) {
    return next(ApiError.badRequest({ errorMsg: "Confirm password Name is required" }));
  }

  if (!role_id) {
    return next(ApiError.badRequest({ errorMsg: "Role Id is required" }));
  }

  // Checking if user exist or not
  getUserByMobileNumber(mobile)
    .then(async (data) => {
      if (data && data.data) {
        return next(ApiError.conflictServerError({ errorMsg: `User already exist with given mobile ${mobile} number` }));
      } else {
        const user = await new VidishaBazaarUser({
          name,
          dob,
          mobile,
          email,
          password,
          confirm_password,
          role_id,
          otp: Math.floor(100000 + Math.random() * 900000),
          last_updated: new Date(),
          created_at: new Date(),
          is_user_active: true,
        });
        user
          .save()
          .then((data) => {
            return next(ApiError.successServerCode({ errorMsg: null, data: data }));
          })
          .catch((error) => {
            console.error(error);
            return next(ApiError.internalServerError({ errorMsg: "something went wrong", error: error.errors.mobile.message }));
          });
      }
    })
    .catch((error) => {
      console.error(error);
      return next(ApiError.internalServerError({ errorMsg: "internal server error", error: error.errors.mobile }));
    });
};

const mobileOptValidation = async (req, res, next) => {
  if (req.body.otp) {
    getUserById(req.body.id)
      .then(async (data) => {
        if (data && data.data && data.data.otp) {
          const dbOtp = data.data.otp;
          if (dbOtp === req.body.otp) {
            await VidishaBazaarUser.update({ _id: req.body.id }, { $set: { is_user_verified: true } })
              .then((data) => {
                return next(ApiError.successServerCode({ errorMsg: null, successMsg: "User is verified now", data }));
              })
              .catch((error) => {
                console.log(error);
                return next(ApiError.internalServerError({ errorMsg: "internal server error" }));
              });
          } else {
            return next(ApiError.unauthorizedServerError({ errorMsg: "Otp is not matching" }));
          }
        } else {
          return next(ApiError.internalServerError({ errorMsg: "Otp or User is not found our database please try again later" }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    return next(ApiError.badRequest({ errorMsg: "Otp is required" }));
  }
};

export { userSignUp, mobileOptValidation };