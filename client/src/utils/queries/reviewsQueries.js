import { gql } from "@apollo/client";

export const GET_ALL_USER_REVIEWS = gql`
  query GetAllUserReviews($userId: ID!) {
    getAllUserReviews(userId: $userId) {
      createdAt
      id
      listing_id
      rating_text
      rating_value
      review_type
      reviewed_user_id
      updatedAt
      user {
        id
        display_name
        user_image
      }
    }
  }
`;

export const GET_LISTING_REVIEWS = gql`
  query GetListingReviews($listingId: ID!) {
    getListingReviews(listingId: $listingId) {
      id
      createdAt
      listing_id
      rating_text
      rating_value
      review_type
      reviewed_user_id
      updatedAt
      user {
        id
        first_name
        last_name
        display_name
        user_image
      }
    }
  }
`;
