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
    // listing_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Listing",
    //   required: true,
    // },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Amenity = model("Amenity", amenitySchema);

// set available amenities
const amenityOptions = [
  { amenity_text: "WiFi", amenity_icon: "wifi_icon.png" },
  { amenity_text: "Swimming Pool", amenity_icon: "pool_icon.png" },
  // Add more predefined amenities as needed
];

// populate database with preset amenities that can be chosen from
const populateAmenities = async () => {
  try {
    // get rid of existing amenities insert updated new ones
    await Amenity.deleteMany({});
    await Amenity.insertMany(amenityOptions);
    console.log("successfully added available amenities to database");
  } catch (error) {
    console.log(error)
  }
}
populateAmenities();

module.exports = Amenity;
