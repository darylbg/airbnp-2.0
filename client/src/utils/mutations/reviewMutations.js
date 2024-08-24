import { gql } from "@apollo/client";

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview(
    $reviewType: String!
    $reviewedUserId: ID!
    $listingId: ID
    $reviewData: reviewInput
  ) {
    createReview(
      reviewType: $reviewType
      reviewed_user_id: $reviewedUserId
      listingId: $listingId
      reviewData: $reviewData
    ) {
      createdAt
      id
      listing_id
      rating_text
      rating_value
      review_type
      reviewed_user_id
      updatedAt
      user_id
    }
  }
`;
