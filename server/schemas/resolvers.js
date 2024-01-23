const { AuthenticationError, ApolloError } = require("apollo-server-express");
const {
  User,
  Listing,
  Amenity,
  Review,
  Notification,
  Payment,
} = require("../models");
const { signToken } = require("../utils/auth");
const { model, default: mongoose } = require("mongoose");
const { findByIdAndUpdate } = require("../models/User");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        try {
          const userData = await User.findOne({ _id: context.user._id })
            .select("-__v -password")
            .populate("user_listings");
          console.log("user_listings", context.user.user_listings);
          return userData;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You need to be logged in");
    },

    getListingById: async (parent, args, context) => {
      try {
        if (context.user) {
          const userListings = await Listing.find({ user_id: context.user.id })
            .populate({ path: "amenities" })
            .populate({ path: "notifications" })
            .populate({ path: "reviews" })
            .populate({ path: "payments" });

          return userListings;
        }
        throw new AuthenticationError("You need to be logged in!");
      } catch (error) {
        console.log(error);
      }
    },

    getAllListings: async (parent, args, context) => {
      try {
        const allListings = await Listing.find({})
          .populate({ path: "amenities" })
          .populate({ path: "reviews" });

        return allListings;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email }).populate({
          path: "user_listings",
        });

        if (!user) {
          throw new AuthenticationError("no user found");
        }

        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError("incorrect password");
        }

        const token = signToken(user);
        console.log("token on login:", JSON.stringify(token));
        return { token: token, user: user };
      } catch (error) {
        console.log(error);
      }
    },
    register: async (parent, { userData }) => {
      try {
        console.log("Received user data:", JSON.stringify(userData));

        const existingUserName = await User.findOne({
          display_name: userData.display_name,
        });
        const existingEmail = await User.findOne({ email: userData.email });

        if (existingUserName) {
          console.log("Username already in use");
          throw new ApolloError(
            "Username already in use",
            "DUPLICATE_DISPLAY_ERROR"
          );
        } else if (existingEmail) {
          console.log("Email already in use");
          throw new ApolloError(
            "Email already in use",
            "DUPLICATE_EMAIL_ERROR"
          );
        }

        const newUser = await User.create(userData);
        const token = signToken(newUser);

        console.log("token:", JSON.stringify(token));
        return { token: token, user: newUser };
      } catch (error) {
        console.log(error);
        // Return null or handle the error as needed
        throw error;
      }
    },
    updateUser: async (parent, { userData }, context) => {
      if (context.user) {
        try {
          const updateUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            {
              $set: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                display_name: userData.display_name,
                gender: userData.gender,
                email: userData.email,
                user_image: userData.user_image,
                saved_listings: userData.saved_listings,
                password: userData.password,
              },
            },
            { new: true }
          );
          return updateUser;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    createListing: async (parent, { listingData }, context) => {
      if (context.user) {
        try {
          const newListing = await Listing.create({
            user_id: context.user._id,
            ...listingData,
          });
          const userId = new mongoose.Types.ObjectId(context.user._id);
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { user_listings: newListing } },
            { new: true }
          ).populate("user_listings");

          return updatedUser;
        } catch (error) {
          throw error;
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },

    updateListing: async (parent, { listingId, listingData }, context) => {
      if (context.user) {
        try {
          const updateListing = await Listing.findByIdAndUpdate(
            { _id: listingId },
            {
              $set: {
                ...listingData,
                listing_title: listingData.listing_title,
                listing_description: listingData.listing_description,
                contact_method: listingData.contact_method,
                listing_image: listingData.listing_image,
                address: listingData.address,
                latitude: listingData.latitude,
                longitude: listingData.longitude,
                availability: listingData.availability,
                price: listingData.price,
              },
            },
            { new: true }
          );
          return updateListing;
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },

    deleteListing: async (parent, { listingId }, context) => {
      if (context.user) {
        try {
          const listing = await Listing.findByIdAndDelete({ _id: listingId });

          if (!listing) {
            throw new Error("Listing not found!");
          }

          const user = await User.findOneAndUpdate(
            { _id: context.user._id }, // Use _id instead of id
            { $pull: { user_listings: { _id: listingId } } },
            { new: true }
          ).populate("user_listings");

          return user;
        } catch (error) {
          console.error(error);
          throw error;
        }
      } else {
        throw new AuthenticationError("You must be logged in!");
      }
    },
    createAmenity: async (parent, { listingId, amenityData }, context) => {
      if (context.user) {
        try {
          const amenity = await Amenity.create({
            listing_id: listingId,
            ...amenityData,
          });

          const listing = await Listing.findOneAndUpdate(
            { _id: listingId },
            { $push: { amenities: amenity.toObject() } }, // Use $push to add the amenity to the array
            { new: true }
          ).populate("amenities");

          return amenity;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;
