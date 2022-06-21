import mongoose from "mongoose";

const shopCategorySchema = new mongoose.Schema({
  category_name: {
    required: true,
    type: String,
  },
  language: {
    english: {
      type: String,
      required: true,
    },
    hindi: {
      type: String,
    },
    hindi_english: {
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

const ShopCategory = mongoose.model("shop-category", shopCategorySchema);

export { ShopCategory };
