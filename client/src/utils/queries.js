import { gql } from "@apollo/client";

export const GET_ALL_LISTINGS = gql`
  query Query {
    getAllListings {
      id
      fullAddress
      addressLine1
      addressLine2
      addressCity
      addressRegion
      addressPostCode
      availability
      contact_method
      created_at
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id
      average_rating {
        count
        value
      }
    }
  }
`;

export const GET_LISTING_BY_ID = gql`
  query getListingById($listingId: ID!) {
    getListingById(listingId: $listingId) {
      id
      fullAddress
      addressLine1
      addressLine2
      addressCity
      addressRegion
      addressPostCode
      availability
      contact_method
      created_at
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id
      average_rating {
        count
        value
      }
    }
  }
`;
