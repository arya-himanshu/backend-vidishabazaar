import mongoose from "mongoose";

const shopProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  title: {
    type: String,
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

  rating: {
    type: String,
  },

  quantity_available: {
    type: String,
    required: true,
  },

  photos: [
    {
      type: String,
    },
  ],

  is_product_in_stock: {
    type: Boolean,
    required: 232,
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

const ShoProductpModel = mongoose.model("shopProduct", shopProductSchema);

export { ShoProductpModel };
