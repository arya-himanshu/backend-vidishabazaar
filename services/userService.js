import { VidishaBazaarUser } from "../models/userModel.js";

const getUserByMobileNumber = async (mobile) => {
  try {
    const user = await VidishaBazaarUser.findOne({ mobile });
    return { data: user };
  } catch (error) {
    console.error("error",error);
    return { data: null };
  }
};

const getUserById = async (userId, callback) => {
  const user = await VidishaBazaarUser.findById({ _id: userId });
  return { data: user };
};

export { getUserByMobileNumber, getUserById };
