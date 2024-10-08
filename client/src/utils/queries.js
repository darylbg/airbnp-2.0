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
      amenities {
        name
        icon
        available
      }
      created_at
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id {
      id
      gender
      first_name
      email
      display_name
      created_at
      average_rating {
        count
        value
      }
      last_name
      user_image
    }
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
      amenities {
        name
        icon
        available
      }
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id {
        id
        display_name
        first_name
        last_name
        user_image
        created_at
        gender
        average_rating {
          value
          count
        }
      }
      average_rating {
        count
        value
      }
    }
  }
`;
