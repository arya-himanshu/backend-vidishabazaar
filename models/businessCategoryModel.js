import mongoose from "mongoose";

const businessCategorySchema = new mongoose.Schema({
  category_name: {
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
  url_path: {
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

const BusinessCategory = mongoose.model("business-category", businessCategorySchema);

export { BusinessCategory };
