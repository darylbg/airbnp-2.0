const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ["GuestReservation", "Review", "General", "Order"],
      required: true,
    },
    notification_status: {
      type: String,
      required: true,
      enum: ["Unread", "Read", "Archived", "Deleted"],
      default: "Unread"
    },
    notification_text: {
      type: String,
      default: "", // Default to an empty string if no text is provided
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster querying
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster querying
    },
    reference_id: {
      type: Schema.Types.ObjectId,
      required: function () {
        return ["GuestReservation", "Review", "Order"].includes(this.notification_type);
      },
    },
    reference_type: {
      type: String,
      enum: ["Booking", "Review", null], 
    },
    reference: {
      type: Schema.Types.Mixed, // Allows storing any type of data
      default: {},
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Create Indexes for faster lookup
notificationSchema.index({ receiver: 1, sender: 1, notification_type: 1 });

// Model creation
const Notification = model("Notification", notificationSchema);

module.exports = Notification;
