import { RegisterUser } from "../models/userSignUpModel.js";

const userSignUp = async (request, response) => {
  const { name, dob, mobile, email, password, confirm_password, role_id } = request.body;

  if (!name) {
    return paramsNotFoundErrorMessage("first_name", "First Name is required", response, 404);
  }
  if (!dob) {
    return paramsNotFoundErrorMessage("dob", "Date of birth is required", response, 404);
  }

  if (!mobile) {
    return paramsNotFoundErrorMessage("mobile", "Mobile Name is required", response, 404);
  } else if (mobile && mobile.length != 10) {
    return paramsNotFoundErrorMessage("mobile", "Mobile number be in 10 digits", response, 500);
  }

  if (password && confirm_password && !checkingPasswordAndConfirmPassword(password, confirm_password)) {
    return response.send({
      message: "Password and confirm password is not match",
      errorCode: 209,
    });
  } else if (!password) {
    return paramsNotFoundErrorMessage("password", "Password Name is required", response, 404);
  } else if (!confirm_password) {
    return paramsNotFoundErrorMessage("confirm_password", "Confirm password Name is required", response, 404);
  }

  if (!role_id) {
    return paramsNotFoundErrorMessage("role_id", "Role Id is required", response, 404);
  }

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
        return response.status(201).send(data);
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).send({ key: "error", errorMessage: "something went wrong" });
      });
  } catch (er) {
    console.error(er);
    return response.status(500).send({ key: "error", errorMessage: "something went wrong" });

  }
};

const userLogIn = (request, response) => {
  response.send('<h1 style="text-align:center;color:red;">A user login module is under development.</h1>');
};

const mobileOptValidation = async (req, res) => {
  await RegisterUser.findById({ _id: req.body.user_id })
    .then((data) => {
      if (!data) {
        res.status(500).send("User not found");
      } else {
        res.status(200).send(data);
      }
    })
    .catch((er) => {
      console.log(er);
      res.status(500).send("internal server error");
    });
};

const checkingPasswordAndConfirmPassword = (password, confirm_password) => {
  if (password === confirm_password) {
    return true;
  } else {
    return false;
  }
};

const paramsNotFoundErrorMessage = (key, message, response, errorCOde) => {
  return response.status(errorCOde ? errorCOde : 200).send({ key: key, errorMessage: message });
};

const generateOtp = ()=>{
  return Math.floor(100000 + Math.random() * 900000);
}

export { userSignUp, userLogIn, mobileOptValidation };
