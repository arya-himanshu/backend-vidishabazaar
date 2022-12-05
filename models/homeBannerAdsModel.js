import mongoose from "mongoose";

const homeBannerAdsSchema = new mongoose.Schema({
  banner_image: {
    type: String,
    required: true,
  },
  customer_mobile: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  ads_validity: {
    type: Date,
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

const HomeBannerAdsModel = new mongoose.model("home_banner_Ad", homeBannerAdsSchema);

export { HomeBannerAdsModel };
