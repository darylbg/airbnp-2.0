const { AuthenticationError, ApolloError } = require("apollo-server-express");
const {
  User,
  Listing,
  Amenity,
  Review,
  Notification,
  Payment,
  Booking,
} = require("../models");
const { signToken } = require("../utils/auth");
const { model, default: mongoose, Mongoose } = require("mongoose");
const { cloudinary } = require("../config/cloudinary");
const stripe = require("stripe")(process.env.stripe_secret_key);
const crypto = require("crypto");

let urlTokens = new Set();

const resolvers = {
  Notification: {
    reference: async (notification) => {
      switch (notification.reference_type) {
        case "Booking":
          return await Booking.findById(notification.reference_id).exec();
        case "Review":
          return await Review.findById(notification.reference_id).exec();
        // case 'Order':
        //   return await Order.findById(notification.reference_id).exec();
        default:
          return null; // Or handle unknown types appropriately
      }
    },
  },
  Reference: {
    __resolveType(obj) {
      if (obj.listing) return "Booking"; // Assume Booking has 'listing' field
      if (obj.rating_value) return "Review"; // Assume Review has 'rating_value' field
      // if (obj.order_status) return 'Order'; // Assume Order has 'order_status' field
      return null; // Or handle unknown types if necessary
    },
  },
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        try {
          const userData = await User.findOne({ _id: context.user._id }).select(
            "-__v -password"
          );
          return userData;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You need to be logged in");
    },
    getUserProfile: async (parent, {userId}, context) => {
      try {
        const userProfile = await User.findById(userId).populate({path: "user_listings"});
        if (!userProfile) {
          console.log("user not found");
        }
        return userProfile;
      } catch (error) {
        
      }
    },
    getListingByUserId: async (parent, args, context) => {
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
    getListingById: async (parent, { listingId }, context) => {
      // Log the received listingId for debugging purposes
      console.log("Received listingId:", listingId);

      // Validate the listingId format
      if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
        console.error("Invalid or missing listingId:", listingId);
        throw new Error("Invalid or missing listingId");
      }

      try {
        // Fetch the listing by ID
        const listing = await Listing.findById(listingId)
          .populate({ path: "amenities" })
          .populate({ path: "reviews" })
          .populate({ path: "payments" });

        // Check if listing is found
        if (!listing) {
          console.log("Listing not found for ID:", listingId);
          return null; // or throw an error based on your use case
        }
        console.log(listing);
        return listing;
      } catch (error) {
        console.error("Error fetching listing:", error);
        throw new Error("Failed to fetch listing");
      }
    },
    getBookingById: async (parent, { booking_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in");
      }
      try {
        const booking = await Booking.findById(booking_id)
          .populate("guest_id")
          .populate("host_id");
        if (!booking) {
          console.log("No booking found with that id");
          throw new Error("No booking found with that id");
        }
        return booking;
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching booking", error);
      }
    },
    getUserBookingHistory: async (parent, { user_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in");
      }
      try {
        const userBookingHistory = await Booking.find({ guest_id: user_id });
        return userBookingHistory;
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching user booking history", error);
      }
    },
    getUserGuestReservations: async (parent, { user_id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in");
      }
      try {
        const userGuestReservations = await Booking.find({ host_id: user_id });
        return userGuestReservations;
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching user guest reservation history", error);
      }
    },
    getAllUserReviews: async (parent, { userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to see reviews");
      }
      try {
        const allUserReviews = await Review.find({
          reviewed_user_id: userId,
        }).populate({ path: "user" });
        return allUserReviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews");
      }
    },
    getListingReviews: async (parent, {listingId}, context) => {
      try {
        const listingReviews = await Review.find({
          listing_id: listingId
        }).populate({path: "user"});

        return listingReviews;
      } catch (error) {
        console.log(error)
      }
    },
    getAllUserNotifications: async (parent, { userId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }

      try {
        // Fetch notifications
        const userNotifications = await Notification.find({ receiver: userId })
          .populate("sender")
          .populate("receiver")
          .exec();

        return userNotifications;
      } catch (error) {
        console.error(error);
        throw new Error("Error fetching notifications");
      }
    },
    generateToken: () => {
      const urlToken = crypto.randomBytes(16).toString("hex");
      urlTokens.add(urlToken);
      return urlToken;
    },
  },

  Mutation: {
    validateToken: (parent, { urlToken }, context) => {
      if (urlTokens.has(urlToken)) {
        urlTokens.delete(urlToken);
        return true;
      } else {
        return false;
      }
    },
    createPaymentIntent: async (parent, { amount }, context) => {
      console.log(context);
      if (!context.user) {
        throw new AuthenticationError("You must be logged in!");
      }
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "gbp",
        });
        return { clientSecret: paymentIntent.client_secret };
      } catch (error) {
        throw new Error(error.message);
      }
    },
    login: async (parent, { email, password }, context) => {
      // console.log("login context", context);
      try {
        const user = await User.findOne({ email }).populate({
          path: "user_listings",
        });

        if (!user) {
          throw new ApolloError(
            "User not found, please register",
            "NO_USER_FOUND_ERROR"
          );
        }

        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new ApolloError(
            "Incorrect password",
            "INCORRECT_PASSWORD_ERROR"
          );
        }

        const token = signToken(user);
        console.log("token on login:", JSON.stringify(token));
        // console.log("login context", context);
        return { token, user };
      } catch (error) {
        console.error("Error during login:", error);
        throw error;
      }
    },
    register: async (parent, { userData, password }) => {
      try {
        const existingEmail = await User.findOne({ email: userData.email });

        if (existingEmail) {
          console.log("Email already in use");
          throw new ApolloError(
            "Email already in use",
            "DUPLICATE_EMAIL_ERROR"
          );
        }

        const newUser = await User.create({
          ...userData,
        password: password});
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
        console.log("this is the user", context.user._id);
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
                // saved_listings: userData.saved_listings,
                // password: userData.password,
              },
            },
            { new: true }
          );
          return updateUser;
        } catch (error) {
          console.error("Update user error:", error);
          throw new ApolloError(
            "Failed to update user details",
            "USER_UPDATE_ERROR"
          );
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },

    createListing: async (parent, { listingData }, context) => {
      console.log("context on create listing", context.user);
      if (context.user) {
        try {
          // Check if listing_data contains listing_image field
          if (
            !listingData.listing_image ||
            listingData.listing_image.length === 0
          ) {
            throw new Error("Listing images are required.");
          }

          // Upload images to Cloudinary
          const uploadedImages = await Promise.all(
            listingData.listing_image.map(async (image) => {
              try {
                const uploadedResponse = await cloudinary.uploader.upload(
                  image,
                  {
                    upload_preset: "n5btmxuv",
                  }
                );
                return uploadedResponse.secure_url;
              } catch (uploadError) {
                console.error(
                  "Error uploading image to Cloudinary:",
                  uploadError
                );
                throw new Error("Failed to upload one or more images.");
              }
            })
          );

          // convert price to a float
          listingData.price = parseFloat(listingData.price);

          const newListing = await Listing.create({
            user_id: context.user._id,
            ...listingData,
            listing_image: uploadedImages,
          });

          const userId = new mongoose.Types.ObjectId(context.user._id);
          const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { user_listings: newListing } },
            { new: true }
          ).populate("user_listings");
          return newListing;
        } catch (error) {
          console.log(error);
          throw new Error("Error creating listing");
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },

    updateListing: async (parent, { listingId, listingData }, context) => {
      if (context.user) {
        try {
          // Check if listing_data contains listing_image field
          if (
            !listingData.listing_image ||
            listingData.listing_image.length === 0
          ) {
            throw new Error("Listing images are required.");
          }

          // Function to check if the image is a Cloudinary URL
          const isCloudinaryUrl = (url) => {
            return (
              url.startsWith("http://res.cloudinary.com/") ||
              url.startsWith("https://res.cloudinary.com/")
            );
          };

          // Upload images to Cloudinary or keep the existing Cloudinary URLs
          const processedImages = await Promise.all(
            listingData.listing_image.map(async (image) => {
              if (isCloudinaryUrl(image)) {
                return image; // If it's already a Cloudinary URL, keep it as is
              } else {
                try {
                  const uploadedResponse = await cloudinary.uploader.upload(
                    image,
                    {
                      upload_preset: "n5btmxuv",
                    }
                  );
                  return uploadedResponse.secure_url; // Return the new Cloudinary URL
                } catch (uploadError) {
                  console.error(
                    "Error uploading image to Cloudinary:",
                    uploadError
                  );
                  throw new Error("Failed to upload one or more images.");
                }
              }
            })
          );

          // Convert price to a float
          listingData.price = parseFloat(listingData.price);

          const updateListing = await Listing.findByIdAndUpdate(
            { _id: listingId },
            {
              $set: {
                ...listingData,
                listing_title: listingData.listing_title,
                listing_description: listingData.listing_description,
                contact_method: listingData.contact_method,
                listing_image: processedImages,
                fullAddress: listingData.fullAddress,
                addressLine1: listingData.addressAutofillInput,
                addressLine2: listingData.addressLine2,
                addressCity: listingData.addressCity,
                addressRegion: listingData.addressRegion,
                addressPostCode: listingData.addressPostCode,
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
          return listing;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      throw new AuthenticationError("You must be logged in!");
    },
    deleteAmenity: async (parent, { amenityId }, context) => {
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
    createReview: async (parent, { reviewData }, context) => {
      console.log("review ", {
        ...reviewData,
      });

      if (!context.user) {
        throw new AuthenticationError("You must be logged in!");
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Create a new review
        const review = await Review.create(
          [
            {
              ...reviewData,
            },
          ],
          { session }
        );

        // Update the reviewed user's reviews array and recalculate average rating
        const user = await User.findOneAndUpdate(
          { _id: reviewData.reviewed_user_id },
          { $push: { reviews: review[0]._id } }, // Correct indexing to get review ID
          { new: true, session }
        );

        const userRatingCount = user.average_rating?.count || 0;
        const userRatingValue = user.average_rating?.value || 0;

        const newUserRatingValue =
          (userRatingValue * userRatingCount + reviewData.rating_value) /
          (userRatingCount + 1);

        user.average_rating = {
          count: userRatingCount + 1,
          value: newUserRatingValue,
        };

        await user.save({ session });

        // If reviewType is "Listing", update the listing's reviews array and recalculate average rating
        if (reviewData.review_type === "Listing" && reviewData.listing_id) {
          const listing = await Listing.findOneAndUpdate(
            { _id: reviewData.listing_id },
            { $push: { reviews: review[0]._id } }, // Correct indexing to get review ID
            { new: true, session }
          );

          const ratingCount = listing.average_rating?.count || 0;
          const ratingValue = listing.average_rating?.value || 0;

          const newRatingValue =
            (ratingValue * ratingCount + reviewData.rating_value) /
            (ratingCount + 1);

          listing.average_rating = {
            count: ratingCount + 1,
            value: newRatingValue,
          };

          await listing.save({ session });
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return review[0]; // Return the created review
      } catch (error) {
        // Abort transaction in case of error
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating review:", error);
        throw new Error("Failed to create review");
      }
    },

    createNotification: async (parent, { notificationInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      console.log("notification input", notificationInput);
      try {
        const notification = await Notification.create({
          ...notificationInput,
          sender: context.user._id,
          reference: {},
        });

        await User.findOneAndUpdate(
          { _id: notificationInput.receiver },
          { $push: { notifications: notification._id } },
          { new: true }
        );

        return notification;
      } catch (error) {
        console.log(error);
        throw new Error("error creating notification");
      }
    },
    updateNotificationStatus: async (
      parent,
      { notificationId, notificationStatus },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      try {
        const updatedNotification = await Notification.findByIdAndUpdate(
          { _id: notificationId },
          { $set: { notification_status: notificationStatus } },
          { new: true }
        );

        return updatedNotification;
      } catch (error) {
        console.log(error);
      }
    },
    deleteNotification: async (
      parent,
      { receiverId, notificationId },
      context
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      try {
        const deletedNotification = await Notification.findOneAndDelete(
          {_id: notificationId},
          {new: true}
        );
        // console.log("deleted noti")
        if (!deletedNotification) {
          console.log("Notification not found.");
          throw new Error("Notification not found");
        }

        // Remove the notification reference from the user's notifications array
        const updatedUser = await User.findOneAndUpdate(
          { _id: receiverId },
          { $pull: { notifications: notificationId } }, // Correct pull syntax if it's just an ID
          { new: true }
        );

        if (!updatedUser) {
          console.log(
            "User not found or notification reference not present in the user's list."
          );
          throw new Error(
            "User not found or notification reference not present in the user's list"
          );
        }

        console.log(
          "Successfully deleted notification from:",
          updatedUser.notifications
        );

        return deletedNotification;
      } catch (error) {
        console.log(error);
      }
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
            { new: true }
          );
          return payment;
        } catch (error) {
          console.log(error);
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },
    createBooking: async (parent, { bookingInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in!");
      }
      try {
        // const listing_id = new mongoose.ObjectId()
        // Fetch the full listing document
        const listing = await Listing.findById(bookingInput.listing);
        if (!listing) {
          throw new Error("Listing not found");
        }

        // Create the booking with the full listing embedded
        const new_booking = await Booking.create({
          ...bookingInput,
          listing: listing.toObject(),
        });

        const guest_id = bookingInput.guest_id;
        const host_id = bookingInput.host_id;
        const new_booking_id = new_booking._id;

        // Update the guest's booking history
        await User.findByIdAndUpdate(
          guest_id,
          { $push: { booking_history: new_booking_id } },
          { new: true }
        );

        // Update the host's guest reservations
        await User.findByIdAndUpdate(
          host_id,
          { $push: { guest_reservations: new_booking_id } },
          { new: true }
        );

        return new_booking;
      } catch (error) {
        console.error("Error creating booking:", error);
        throw new Error("Error creating booking: " + error.message);
      }
    },
    updateBooking: async (parent, { bookingId, bookingInput }, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in!");
      }
      try {
        // const booking
        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            ...bookingInput,
            number_of_people: bookingInput.number_of_people,
            arrival_time: bookingInput.arrival_time,
            booking_status: bookingInput.booking_status,
            booking_status_updated_at: bookingInput.booking_status_updated_at,
            total_price: bookingInput.total_price,
            payment_status: bookingInput.payment_status,
            special_requests: bookingInput.special_requests,
            listing: bookingInput.listing._id,
            guest_id: bookingInput.guest_id,
            host_id: bookingInput.host_id,
          },
          { new: true }
        );

        return booking;
      } catch (error) {
        console.log(error);
        throw new Error("Error updating booking", error);
      }
    },
  },
};

module.exports = resolvers;
