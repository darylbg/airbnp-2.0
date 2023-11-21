const { Schema, model, Types } = require("mongoose");

const paymentSchema = new Schema(
  {
    amount_paid: {
      type: Number,
      required: true,
    },
    guest_quantity: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now
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

const Payment = model("Payment", paymentSchema);

module.exports = Payment;
