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
            .populate("user_listings")
            .populate("amenities");
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
            // .populate({ path: "notifications" })
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
          // .populate({ path: "notifications" })
          .populate({ path: "reviews" })
          .populate({ path: "payments" });

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
        const existingEmail = await User.findOne({ email: userData.email });

        if (existingEmail) {
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
          const listing_id = new mongoose.Types.ObjectId(listingId);
          const listing = await Listing.findOneAndUpdate(
            { _id: listing_id },
            { $push: { amenities: amenity } },
            { new: true }
          )
            .populate({ path: "amenities" })
            // .populate({ path: "notifications" })
            .populate({ path: "reviews" })
            .populate({ path: "payments" });
          console.log("listing", listing);
          return listing;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      throw new AuthenticationError("You must be logged in!");
    },
    deleteAmenity: async (parents, { amenityId }, context) => {
      if (context.user) {
        try {
          const amenity = await Amenity.findByIdAndDelete(amenityId);
          const listing = await Listing.findByIdAndUpdate(
            { _id: amenity.listing_id },
            { $pull: { amenities: { _id: amenityId } } },
            { new: true }
          )
            .populate({ path: "amenities" })
            // .populate({ path: "notifications" })
            .populate({ path: "reviews" })
            .populate({ path: "payments" });
          return listing;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    createReview: async (parent, { listingId, reviewData }, context) => {
      if (context.user) {
        console.log("user", context.user._id);
        try {
          const review = await Review.create({
            user_id: context.user._id,
            listing_id: listingId,
            ...reviewData,
          });
          console.log("listingId", listingId);
          console.log("reviewData", reviewData);
          const listing = await Listing.findOneAndUpdate(
            { _id: listingId },
            { $push: { reviews: review } },
            { new: true }
          )
            .populate({ path: "amenities" })
            // .populate({ path: "notifications" })
            .populate({ path: "reviews" })
            .populate({ path: "payments" });

          return review;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    createNotification: async (
      parent,
      { userId, listingId, notificationData },
      context
    ) => {
      if (context.user) {
        try {
          const notification = await Notification.create({
            user_id: context.user._id,
            listing_id: listingId,
            ...notificationData,
          });

          const listing = await Listing.findById({ _id: listingId });
          const user = await User.findOneAndUpdate(
            { _id: listing.user_id },
            { $push: { notifications: notification } },
            { new: true }
          );
          return notification;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    createPayment: async (parent, { listingId, paymentData }, context) => {
      if (context.user) {
        try {
          const payment = await Payment.create({
            user_id: context.user._id,
            listing_id: listingId,
            ...paymentData,
          });
          const listing = await Listing.findById({ _id: listingId });
          const user = await User.findOneAndUpdate(
            { _id: listing.user_id },
            { $push: { payments: payment } },
            { new: true }
          );

          return payment;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    updatePayment: async (parent, { paymentId, paymentData }, context) => {
      if (context.user) {
        try {
          const payment = await Payment.findOneAndUpdate(
            { _id: paymentId },
            {
              amount_paid: paymentData.amount_paid,
              guest_quantity: paymentData.guest_quantity,
              currency: paymentData.currency,
              payment_method: paymentData.payment_method,
              payment_status: paymentData.payment_status,
            },
            {new: true}
          );
          return payment;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
  },
};

module.exports = resolvers;
