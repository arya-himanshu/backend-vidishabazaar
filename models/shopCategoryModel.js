import mongoose from "mongoose";

const shopCategorySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  language: {
    in_eg: {
      type: String,
      required: true,
    },
    in_hi: {
      type: String,
    },
    hi_eg: {
      type: String,
    },
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

const ShopCategory = mongoose.model("shop_category", shopCategorySchema);

export { ShopCategory };
