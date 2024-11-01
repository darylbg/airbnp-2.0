const { Schema, model } = require("mongoose");
const User = require("./User");

const reviewSchema = new Schema(
  {
    review_type: {
      type: String,
      enum: ["User", "Listing"],
      required: true
    },
    rating_value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    rating_text: {
      type: String,
    },
    user: {  // Reference to the User who wrote the review
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    reviewed_user_id: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    listing_id: {  // The listing being reviewed, not required if reviewing a user
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Adding indexes
reviewSchema.index({ user: 1 });
reviewSchema.index({ listing_id: 1 });
reviewSchema.index({ reviewed_user_id: 1 });
reviewSchema.index({ rating_text: "text" });

const Review = model("Review", reviewSchema);

module.exports = Review;
