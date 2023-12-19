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
const { model } = require("mongoose");

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      try {
        if (context.user) {
          const userData = await User.findOne({ id: context.user.id })
            .select("-__v -password")
            .populate({
              path: "user_listings",
              populate: { path: "amenities" },
              populate: { path: "notifications" },
              populate: { path: "reviews" },
              populate: { path: "payments" },
            })
            .populate({
              path: "saved_listings",
              populate: { path: "amenities" },
              populate: { path: "notifications" },
              populate: { path: "reviews" },
              populate: { path: "payments" },
            })
            .populate({ path: "notifications" })
            .populate({ path: "reviews" })
            .populate({ path: "payments" })
            .populate({ path: "booking_history" });
          return userData;
        } else {
          throw new AuthenticationError("You need to be logged in");
        }
      } catch (error) {
        console.log(error);
      }
    },

    getListingById: async (parent, args, context) => {
        try {
            if (context.user) {
                const userListings = await Listing.find({user_id: context.user.id})
                    .populate({path: 'amenities'})
                    .populate({path: 'notifications'})
                    .populate({path: 'reviews'})
                    .populate({path: 'payments'});
    
                return userListings;
            }
            throw new AuthenticationError('You need to be logged in!');
        } catch (error) {
            console.log(error)
        }
    },

    getAllListings: async (parent, args, context) => {
        try {
            const allListings = await Listing.find({})
            .populate({path: 'amenities'})
            .populate({path: 'reviews'})
    
            return allListings;
        } catch (error) {
            console.log(error)
        }
    }
  },

  Mutation: {
    login: async (parent, {email, password}) => {
      try {
        const user = await User.findOne({ email })
        .populate({
          path: "user_listings",
          populate: { path: "amenities" },
          populate: { path: "notifications" },
          populate: { path: "reviews" },
          populate: { path: "payments" },
        })
        .populate({
          path: "saved_listings",
          populate: { path: "amenities" },
          populate: { path: "notifications" },
          populate: { path: "reviews" },
          populate: { path: "payments" },
        })
        .populate({ path: "notifications" })
        .populate({ path: "reviews" })
        .populate({ path: "payments" })
        .populate({ path: "booking_history" });

        if (!user) {
          throw new AuthenticationError('no user found')
        }

        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('incorrect password')
        }

        const token = signToken(user);
        return { token, user};

      } catch (error) {
        console.log(error)
      }
    },
    register: async (parent, {userData}) => {
      try {
        const newUser = await User.create(userData);
        const token = signToken(newUser);
        console.log(`new user token ${userData}`);
        return {token, newUser};
        
      } catch (error) {
        console.log(error)
      }
    }
  }
};

module.exports = resolvers;
