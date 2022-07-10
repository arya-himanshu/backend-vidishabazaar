import { VidishaBazaarUser } from "../models/userModel.js";

const getUserByMobileNumber = async (mobile) => {
  try {
    const user = await VidishaBazaarUser.findOne({ mobile });
    return user;
  } catch (error) {
    console.error("error",error);
    return null;
  }
};

const getUserById = async (userId, callback) => {
  const user = await VidishaBazaarUser.findById({ _id: userId });
  return  user
};

export { getUserByMobileNumber, getUserById };
