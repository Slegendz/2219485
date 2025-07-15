import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortcode: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    validity: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000),
      expires: 0,
    },
  },
  { timeStamps: true }
);

const Url = mongoose.model("Url", urlSchema);
export default Url;
