import { OtpHostoryModel } from "../models/appOtpHistory.js";

const iotpd = async (data) => {
  try {
    const {otp, mobile, shop_id, user_id } = data;
    const history = await OtpHostoryModel({otp, mobile, shop_id, user_id, created_at: new Date() });
    await history.save();
  } catch (err) {
    console.error(err);
  }
};
export { iotpd };
