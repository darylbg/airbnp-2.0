import { gql } from "@apollo/client";

export const GET_USER_BY_ID_QUERY = gql`
query User($userId: ID!) {
  user(id: $userId) {
    created_at
    display_name
    email
    first_name
    gender
    id
    last_name
    user_image
  }
}`

export const GET_USER_PROFILE = gql`
query GetUserProfile($userId: ID!) {
  getUserProfile(userId: $userId) {
    id
    first_name
    display_name
    created_at
    last_name
    average_rating {
      value
      count
    }
    reviews
    user_image
    user_listings {
      availability
      average_rating {
        value
        count
      }
      created_at
      fullAddress
      id
      listing_image
      reviews
      price
      listing_title
      listing_description
      user_id
    }
  }
}`;