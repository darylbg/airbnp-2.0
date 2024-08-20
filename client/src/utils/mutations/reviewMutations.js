import { gql } from "@apollo/client";

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview(
    $reviewedUserId: ID!
    $listingId: ID
    $reviewData: reviewInput
  ) {
    createReview(
      reviewed_user_id: $reviewedUserId
      listingId: $listingId
      reviewData: $reviewData
    ) {
      id
      listing_id
      rating_text
      rating_value
      reviewed_user_id
      user_id
    }
  }
`;
