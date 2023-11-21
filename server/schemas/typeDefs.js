const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
`