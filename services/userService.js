import { VidishaBazaarUser } from "../models/userModel.js";
import fetch from "node-fetch";

const getUserByMobileNumber = async (mobile) => {
  try {
    const user = await VidishaBazaarUser.findOne({ mobile });
    return user;
  } catch (error) {
    console.error("error", error);
    return null;
  }
};

const getUserById = async (userId, callback) => {
  const user = await VidishaBazaarUser.findById({ _id: userId });
  return user
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

const sendOtp = async (text, mobile) => {
  try {
    // fetch(`http://mysms.msg24.in/api/mt/SendSMS?user=${process.env.SMS_USER_NAME}&password=${process.env.SMS_PASSWORD}&senderid=${process.env.SMS_SENDERID}&channel=TRANS&DCS=0&flashsms=0&number=${mobile}&text=${text}&route=08&Peid=${process.env.SMS_PEID}&DLTTemplateId=${process.env.SMS_TEMPLATEID}`)
    //   .then((res) => {
    //     console.error(res);
    //     Promise.resolve(res);
    //   })
    //   .catch((er) => {
    //     console.error(er);
    //     Promise.reject(er);
    //   });
  } catch (er) {
    console.error(er);
    Promise.reject(er);
  }
};

export { getUserByMobileNumber, getUserById, generateOtp, sendOtp };
