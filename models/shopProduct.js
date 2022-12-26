import mongoose from "mongoose";

const shopProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  shop_id: {
    type: String,
    required: true,
  },

  price: {
    type: String,
    required: true,
  },

  quantity: {
    type: String,
    required: true,
  },

  rating: {
    type: String,
  },
  unit: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],

  last_updated: {
    type: Date,
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
  },
});

const ShoProductpModel = mongoose.model("shop_product", shopProductSchema);

export default ShoProductpModel;
