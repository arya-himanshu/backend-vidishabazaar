import mongoose from "mongoose";

const customerInteractionDataSchema = new mongoose.Schema({
  unique_key: {
    type: String,
  },

  data_obj: {
    type: Object,
  },

  session_id: {
    type: String,
    required: false,
  },

  user_id: {
    type: String,
    required: false,
  },

  banner_id: {
    type: String,
    required: false,
  },
  shop_id: {
    type: String,
    required: false,
  },

  category_id: {
    type: String,
  },

  sub_category_id: {
    type: String,
  },

  last_updated: {
    type: Date,
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
  },
});

const CustomerInteractionDataModel = mongoose.model("customer_interaction", customerInteractionDataSchema);

export { CustomerInteractionDataModel };
