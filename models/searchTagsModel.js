import mongoose from "mongoose";

const searchTags = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
  },
  categoryUrl: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
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

const SearchTagsModel = mongoose.model("search-tag", searchTags);

export { SearchTagsModel };
