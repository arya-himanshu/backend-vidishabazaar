import { RegisterUser } from "../models/userSignUpModel.js";
import bcrypt from "bcrypt";
import ApiError from "../error/ApiError.js";
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

  if (password && confirm_password && !checkingPasswordAndConfirmPassword(password, confirm_password)) {
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
        try {
          const registerUser = await new RegisterUser({
            name,
            dob,
            mobile,
            email,
            password,
            confirm_password,
            role_id,
            otp: generateOtp(),
            last_updated: new Date(),
            created_at: new Date(),
            is_user_active: true,
          });
          await registerUser
            .save()
            .then((data) => {
              return next(ApiError.successServerCode({ errorMsg: null, data: data }));
            })
            .catch((error) => {
              return next(ApiError.internalServerError({ errorMsg: "something went wrong" }));
            });
        } catch (er) {
          return next(ApiError.internalServerError({ errorMsg: "something went wrong" }));
        }
      }
    })
    .catch((error) => {
      return next(ApiError.internalServerError({ errorMsg: "internal server error" }));
    });
};

const mobileOptValidation = async (req, res, next) => {
  getUserById(req.body.id, async (error, data) => {
    if (error) {
      return next(ApiError.badRequest({ errorMsg: error }));
    } else {
      const dbOtp = data.data.otp;
      if (dbOtp === req.body.otp) {
        await RegisterUser.update({ _id: req.body.id }, { $set: { is_user_verified: true } })
          .then((data) => {
            console.log(data);
            return next(ApiError.successServerCode({ errorMsg: null, successMsg: "User is verified now", data }));
          })
          .catch((error) => {
            console.log(error);
            return next(ApiError.internalServerError({ errorMsg: "internal server error" }));
          });
      } else {
        return next(ApiError.unauthorizedServerError({ errorMsg: "Otp is not matching" }));
      }
    }
  });
};

const getUserById = async (userId, callback) => {
  const user = await RegisterUser.findById({ _id: userId })
    .then((data) => {
      if (!data) {
        callback({ error: "User not found!" }, undefined);
      } else {
        callback(undefined, { data });
      }
    })
    .catch((er) => {
      callback({ error: "Internal server error" }, undefined);
    });
  return user;
};

const checkingPasswordAndConfirmPassword = (password, confirm_password) => {
  if (password === confirm_password) {
    return true;
  } else {
    return false;
  }
};

// User login start from here
const userLogIn = async (request, response, next) => {
  const { mobile, password } = request.body;
  getUserByMobileNumber(mobile)
    .then((data) => {
      if (data && data.data) {
        bcrypt.compare(password, data.data.password, function (error, result) {
          if (result) {
            return next(ApiError.successServerCode({ errorMsg: null, data: data }));
          } else if (!error) {
            return next(ApiError.unauthorizedServerError({ errorMsg: "Mobile or password is not matching" }));
          } else if (error) {
            return next(ApiError.internalServerError({ errorMsg: "Internal server  error >" + error }));
          }
        });
      } else {
        return next(ApiError.unauthorizedServerError({ errorMsg: "Mobile or password is not matching" }));
      }
    })
    .catch((error) => {
      if (error && error.errorMsg) {
        return next(ApiError.internalServerError({ errorMsg: error.errorMsg }));
      } else {
        return next(ApiError.internalServerError({ errorMsg: "Internal server  error" }));
      }
    });
};

const getUserByMobileNumber = async (mobile) => {
  return await RegisterUser.findOne({ mobile })
    .then((data) => {
      if (data) {
        return Promise.resolve({ data });
      } else {
        return Promise.resolve({ errorMsg: "User not found in database" });
      }
    })
    .catch((error) => {
      return Promise.reject({ error, errorMsg: "Internal Server error" });
    });
};

// Generic code is start here

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
export { userSignUp, userLogIn, mobileOptValidation };
