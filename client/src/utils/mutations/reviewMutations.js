import { gql } from "@apollo/client";

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($reviewData: reviewInput) {
    createReview(reviewData: $reviewData) {
      createdAt
      id
      listing_id
      rating_text
      rating_value
      review_type
      reviewed_user_id
      updatedAt
      # user 
    }
  }
`;
