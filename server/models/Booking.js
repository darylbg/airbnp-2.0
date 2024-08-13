const { Schema, model, Types } = require("mongoose");
const Listing = require("./Listing");
const User = require("./User");

const bookingSchema = new Schema(
  {
    listing: {
      // capture listing at time of booking. consistent even if listing changes
      type: Listing.schema,
      required: true,
    },
    listing_url: {
      type: String,
    },
    guest_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    number_of_people: {
      type: Number,
      required: true,
    },
    arrival_time: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      // required: true,
      default: Date.now,
    },
    booking_status: {
      type: String,
      required: true,
      enum: ["Active", "Upcoming", "Completed"],
    },
    booking_status_updated_at: {
      type: String,
    },
    total_price: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
      enum: ["Paid", "Pending", "Cancelled", "Refunded"],
    },
    special_requests: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
