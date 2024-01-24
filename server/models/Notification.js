const { Schema, model, Types } = require("mongoose");

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      required: true,
    },
    notification_text: {
      type: String,
    },
    travel_time: {
      type: String,
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

    listing_id: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Notification = model("Notification", notificationSchema);

module.exports = Notification;
