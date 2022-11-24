import mongoose from "mongoose";

const shopRegistrationSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
    indexe: true,
  },

  shop_gst_number: {
    type: String,
  },

  shop_owner_user_id: {
    type: String,
    required: true,
  },

  shop_address: {
    type: String,
    required: true,
    indexe: true,
  },

  shop_city: {
    type: String,
    indexe: true,
  },

  shop_pincode: {
    type: String,
  },

  shop_mobile: {
    type: String,
    required: true,
    indexe: true,
  },

  shop_category_id: {
    type: String,
    required: true,
  },

  shop_photo: {
    type: String,
  },

  is_shop_active: {
    type: Boolean,
    required: true,
  },

  is_shop_varified: {
    type: Boolean,
    required: true,
  },

  shop_rating: {
    type: String,
  },

  description: {
    type: String,
  },

  shop_image: {
    type: String,
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
      indexe: true,
    },
  ],

  shopSearchString: {
    type: String,
    required: false,
    indexe: true,
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

  last_updated: {
    type: Date,
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
  },
});

shopRegistrationSchema.index({ shop_name: "text" }); // schema level

const ShopModel = mongoose.model("shop", shopRegistrationSchema);

export { ShopModel };
