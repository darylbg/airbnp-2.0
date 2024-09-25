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
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
      },
    ],
    amenities: [
      {
        name: {
          type: String,
          required: true,
        },
        icon: {
          type: String, // URL or identifier for the amenity icon
          required: true,
        },
        available: {
          type: Boolean, // True if the amenity is available, false otherwise
          default: false,
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);


// function to insert defaultAmenites with availability false here so they are immediatly accessible when addeing  a new listing on the front end ie display all of them with unchecked checkbox

const Listing = model("Listing", listingSchema);

module.exports = Listing;
