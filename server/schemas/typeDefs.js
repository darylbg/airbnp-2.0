const { gql } = require("apollo-server-express");

const typeDefs = gql`

# Types
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String
    email: String!
    created_at: String
    user_image: String
    user_listings: [Listing]
    saved_listings: [Listing]
    notifications: [Notification]
    reviews: [Review]
    payments: [Payment]
    booking_history: [Listing]
  }

  type Listing {
    id: ID!
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
    user_id: ID!
    amenities: [Amenity]
    notifications: [Notification]
    reviews: [Review]
    payments: [Payment]
  }

  type Amenity {
    id: ID!
    amenity_text: String
    amenity_icon: String
    listing_id: ID!
  }

  type Review {
    id: ID!
    rating_value: Int
    rating_text: String
    created_at: String
    user_id: ID!
    listing_id: ID!
  }

  type Notification {
    id: ID!
    notification_text: String
    travel_time: String
    created_at: String
    user_id: ID!
    listing_id: ID!
  }

  type Payment {
    id: ID!
    amount_paid: Float
    guest_quantity: Int
    currency: String
    payment_method: String
    payment_status: String
    created_at: String
    user_id: ID!
    listing_id: ID!
  }

  # authorization type

  type Auth {
    token: ID!
    user: User
  }

  # inputs

  input userInput {
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String!
    email: String!
    user_image: String
    saved_listings: [savedListingInput]
    password: String!
  }

  input savedListingInput {
    listing_id: ID!
  }

  input listingInput {
    listing_title: String!
    listing_description: String
    contact_method: String
    listing_image: String
    address: String!
    latitude: Int!
    longitude: Int!
    availability: Boolean
    price: Float!
    amenities: [amenityInput]
  }

  input amenityInput {
    amenity_text: String
    amenity_icon: String
  }
  
  input reviewInput {
    rating_value: Int
    rating_text: String
  }

  input notificationInput {
    notification_text: String
    travel_time: String
  }

  input paymentInput {
    amount_paid: Float
    guest_quantity: Int
    currency: String
    payment_method: String
    payment_status: String
  }

  # queries
  type Query {
    user(id: ID!): User
    getListingById(user_id: ID!): Listing
    getAllListings: [Listing]
  }

  # mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(userData: userInput!): Auth
    updateUser(userData: userInput): User
    createListing(listingData: listingInput): User
    updateListing(listingId: ID!, listingData: listingInput): Listing
    deleteListing(listingId: ID!): User
    createAmenity(listingId: ID!, amenityData: amenityInput): Listing
    deleteAmenity(amenityId: ID!): Listing
    createReview(userId: ID!, listingId: ID!, reviewData: reviewInput): Review
    createNotification(userId: ID!, listingId: ID!, notificationData: notificationInput): Notification
    createPayment(userId: ID!, listingId: ID!, paymentData: paymentInput): Payment
    updatePayment(paymentId: ID!, paymentData: paymentInput): Payment
  }
`;

module.exports = typeDefs;
