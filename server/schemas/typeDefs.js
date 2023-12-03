const { gql } = require("apollo-server-express");

const typeDefs = gql`

# User
  type User {
    _id: ID!
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String!
    email: String!
    created_at: Int!
    user_image: String
    saved_listings: [Listing]
    notifications: [Notification]
    reviews: [Review]
    payments: [Payment]
    booking_history: [Listing]
  }

  input createUser {
    _id: ID!
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String!
    email: String!
  }

  input updateUser {
    _id: ID!
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String!
    email: String!
    user_image: String
  }

    input deleteUser {
        _id: ID!
    }

# Listing
  type Listing {
    _id: ID!
    listing_title: String!
    listing_description: String
    contact_method: String
    listing_image: String
    address: String!
    latitude: Int!
    longitude: Int!
    availability: Boolean!
    price: Float!
    created_at: String
    amenities: [Amenity]
    notifications: [Notification]
    reviews: [Review]
    payments: [Payment]
  }

  input createListing {
    _id: ID!
    listing_title: String!
    listing_description: String
    contact_method: String
    listing_image: String
    address: String!
    latitude: Int!
    longitude: Int!
    availability: Boolean!
    price: Float!
    amenities: [Amenity]
  }

  input updateListing {
    _id: ID!
    listing_title: String!
    listing_description: String
    contact_method: String
    listing_image: String
    address: String!
    latitude: Int!
    longitude: Int!
    availability: Boolean!
    price: Float!
    amenities: [Amenity]
  }

  input deleteListing {
    _id: ID!
  }

  type query {
    # user queries
    user: [User!]!
    user(_id: ID!) User!
    # listing queries
    getAllListings: [Listing]
    getListingsByUser(_id: ID!) [Listing]
  }


`;
