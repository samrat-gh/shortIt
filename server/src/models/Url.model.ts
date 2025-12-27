import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    shorturl: {
      type: String,
      require: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Url = mongoose.model("Url", UrlSchema);
