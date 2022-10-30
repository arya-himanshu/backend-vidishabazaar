import mongoose from "mongoose";

const languageTranslateStringSchema = new mongoose.Schema({
  language_string: {
    type: Object,
    required: true,
  },
  string_text: {
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

const TranslateLanguageString = new mongoose.model("language-string", languageTranslateStringSchema);

export { TranslateLanguageString };
