import mongoose from "mongoose";

const shopRegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  gst_number: {
    type: String,
  },

  owner_user_id: {
    type: String,
  },

  address: {
    type: String,
    required: true,
  },

  map_lng_lat: {
    type: Object,
    required: false,
  },

  city: {
    type: String,
  },

  pincode: {
    type: String,
  },

  mobile: {
    type: String,
    required: true,
  },

  category_id: {
    type: String,
    required: true,
  },

  is_shop_active: {
    type: Boolean,
    required: true,
  },

  is_shop_varified: {
    type: Boolean,
    required: true,
  },

  rating: {
    type: String,
  },

  description: {
    type: String,
  },

  images: {
    type: [],
  },

  shop_id: {
    type: String,
    indexe: true,
  },

  is_shop_Physically_available: {
    type: Boolean,
    required: true,
  },

  shop_tags: [
    {
      type: Object,
      required: false,
    },
  ],

  search_string: {
    type: String,
    required: false,
  },

  days: [
    {
      type: String,
      required: false,
    },
  ],

  opening_time: {
    type: String,
    required: false,
  },

  closing_time: {
    type: String,
    required: false,
  },

  otp: {
    type: String,
    required: true,
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

shopRegistrationSchema.index({ name: "text", category_id: "text" }); // schema level

const ShopModel = mongoose.model("shop", shopRegistrationSchema);

export { ShopModel };
