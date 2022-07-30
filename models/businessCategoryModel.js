import mongoose from "mongoose";

const businessCategorySchema = new mongoose.Schema({
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

const BusinessCategory = mongoose.model("business-category", businessCategorySchema);

export { BusinessCategory };
