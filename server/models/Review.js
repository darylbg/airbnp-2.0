const { Schema, model, Types } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating_value: {
      type: Number,
      required: true,
    },
    rating_text: {
      type: String,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    user_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    ],
    listing_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
