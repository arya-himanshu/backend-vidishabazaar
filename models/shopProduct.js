import mongoose from "mongoose";

const shopProductSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_description: {
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

  rating: {
    type: String,
  },

  photos: [
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

const ShoProductpModel = mongoose.model("shop-product", shopProductSchema);

export default ShoProductpModel ;
