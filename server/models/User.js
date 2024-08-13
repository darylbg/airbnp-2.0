const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      required: true,
      // unique: true,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address",
    },
    password: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    user_image: {
      type: String,
      // default: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
    },
    user_listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        // required: true
      },
    ],
    saved_listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        // required: true
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
        // required: true
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        // required: true
      },
    ],
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        // required: true
      },
    ],
    booking_history: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        // required: true
      },
    ],
    guest_reservations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
        // required: true
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// validate user password to log in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
