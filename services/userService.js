import { VidishaBazaarUser } from "../models/userModel.js";

const getUserByMobileNumber = async (mobile) => {
  const user = await VidishaBazaarUser.findOne({ mobile });
  return { data: user };
};

const getUserById = async (userId, callback) => {
  const user = await VidishaBazaarUser.findById({ _id: userId });
  return { data: user };
};

export { getUserByMobileNumber, getUserById };
