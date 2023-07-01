import mongoose from "mongoose";

const dailyWageLabour = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  is_contractor: {
    type: Boolean,
    required: true,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  Search_tag: {
    type: String,
    required: false,
  },
  category_id: {
    type: String,
    required: true,
  },
  added_by: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
  update_at: {
    type: Date,
    required: true,
  },
});

const DailyWageLabourModel = mongoose.model("dailyWageLabour", dailyWageLabour);

export { DailyWageLabourModel };
