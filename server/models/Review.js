const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating_value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    rating_text: {
      type: String,
    },
    user_id: {  // The user who wrote the review
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewed_user_id: {  // The user being reviewed (if applicable)
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    listing_id: {  // The listing being reviewed
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Adding indexes
reviewSchema.index({ user_id: 1 });
reviewSchema.index({ listing_id: 1 });
reviewSchema.index({ reviewed_user_id: 1 });
reviewSchema.index({ rating_text: "text" });

const Review = model("Review", reviewSchema);

module.exports = Review;
