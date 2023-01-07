import mongoose from "mongoose";

const otpHistorySchema = new mongoose.Schema({
    otp: {
        required: true,
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },  mobile: {
        type: String,
        required: true,
    },
    shop_id: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        required: true,
    },
});

const OtpHostoryModel = mongoose.model("otp_history", otpHistorySchema);

export { OtpHostoryModel };
