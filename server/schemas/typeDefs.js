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
    listing_image: [String]
    fullAddress: String!
    addressLine1: String!
    addressLine2: String
    addressCity: String
    addressRegion: String
    addressPostCode: String
    latitude: Float!
    longitude: Float!
    availability: Boolean!
    price: Float!
    created_at: String
    user_id: ID!
    amenities: [ListingAmenity]
    reviews: [Review]
    payments: [Payment]
  }

  type ListingAmenity {
    amenity_id: ID!
    available: Boolean!
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
    notification_text: String!
    notification_type: String!
    travel_time: String!
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
    # id: [ID!]
    first_name: String!
    last_name: String!
    display_name: String!
    gender: String
    email: String!
    user_image: String
    user_listings: [ID!]
    saved_listings: [ID!]
    notifications: [ID!]
    reviews: [ID!]
    payments: [ID!]
    booking_history: [ID!]
    password: String!
  }

  input userListingInput {
    listing_id: ID!
  }

  input savedListingInput {
    listing_id: ID!
  }

  input bookingHistoryInput {
    listing_id: ID!
  }

  input listingInput {
    listing_title: String!
    listing_description: String
    contact_method: String
    listing_image: [String]
    fullAddress: String!
    addressLine1: String!
    addressLine2: String
    addressCity: String
    addressRegion: String
    addressPostCode: String
    latitude: Float!
    longitude: Float!
    availability: Boolean
    price: Float!
    amenities: [ID!] # List of amenity IDs to mark as available
    payments: [ID!]
    reviews: [ID!]
  }

  input amenityInput {
    # amenity_text: String
    # amenity_icon: String
    id: ID!
  }

  input reviewInput {
    rating_value: Int
    rating_text: String
  }

  input notificationInput {
    notification_text: String
    travel_time: String
    notification_type: String
  }

  input paymentInput {
    amount_paid: Float
    guest_quantity: Int
    currency: String
    payment_method: String
    payment_status: String
  }

  type PaymentIntent {
    clientSecret: String!
  }

  # queries
  type Query {
    user(id: ID!): User
    getListingById(user_id: ID!): Listing
    getAllListings: [Listing]
    # sessionStatus(sessionId: String!): SessionStatusResponse!
  }

  # mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(userData: userInput!): Auth
    updateUser(userData: userInput): User
    createListing(listingData: listingInput): Listing
    updateListing(listingId: ID!, listingData: listingInput): Listing
    deleteListing(listingId: ID!): User
    createAmenity(amenityData: amenityInput): Listing
    deleteAmenity(amenityId: ID!): Listing
    createReview(listingId: ID!, reviewData: reviewInput): Review
    createNotification(
      listingId: ID!
      notificationData: notificationInput
    ): Notification
    createPaymentIntent(amount: Int!): PaymentIntent!
    createPayment(listingId: ID!, paymentData: paymentInput): Payment
    updatePayment(paymentId: ID!, paymentData: paymentInput): Payment
  }
`;

module.exports = typeDefs;
