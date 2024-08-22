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
    fullAddress: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String,
    },
    addressCity: {
      type: String,
    },
    addressRegion: {
      type: String,
    },
    addressPostCode: {
      type: String,
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
    average_rating: {
      count: {
        type: Number,
        default: 0
      },
      value: {
        type:Number,
        default: 0
      }
    },
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
