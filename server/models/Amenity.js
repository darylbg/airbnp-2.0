const { Schema, model, Type } = require("mongoose");

const amenitySchema = new Schema(
  {
    amenity_text: {
      type: String,
      required: true,
    },
    amenity_icon: {
      type: String,
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

const Amenity = model("Amenity", amenitySchema);

module.exports = Amenity;
