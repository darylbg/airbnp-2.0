const { Schema, model, Types } = require("mongoose");

const listingSchema = new Schema(
  {
    listing_title: {
      type: String,
      required: true,
    },
    listing_description: {
      type: String,
    },
    contact_method: {
      type: String,
    },
    listing_image: {
      type: [String],
      required: true
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: false,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amenities: [
      {
        amenity_id: {
          type: Schema.Types.ObjectId,
          ref: "Amenity",
          required: true,
        },
        available: {
          type: Boolean,
          default: false,
        },
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
        required: true,
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        required: true,
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Listing = model("Listing", listingSchema);

module.exports = Listing;
