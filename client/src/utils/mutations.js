import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation register($userData: userInput!) {
    register(userData: $userData) {
      token
      user {
        id
        email
        first_name
        last_name
        gender
        display_name
        user_image
        user_listings {
          id
        }
        saved_listings {
          id
        }
        notifications {
          id
        }
        reviews {
          id
        }
        payments {
          id
        }
        booking_history {
          id
        }
      }
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        first_name
        last_name
        gender
        display_name
        user_image
        user_listings {
          id
          user_id
          created_at
          listing_title
          listing_description
          listing_image
          price
          address
          latitude
          longitude
          availability
          contact_method
          amenities {
            amenity_id
            available
          }
          payments {
            id
          }
          reviews {
            id
          }
        }
        saved_listings {
          id
        }
        notifications {
          id
        }
        reviews {
          id
        }
        payments {
          id
        }
        booking_history {
          id
        }
      }
    }
  }
`;

export const NEW_LISTING_MUTATION = gql`
  mutation CreateListing($listingData: listingInput) {
    createListing(listingData: $listingData) {
      id
      user_id
      listing_title
      listing_description
      listing_image
      address
      longitude
      latitude
      contact_method
      amenities {
        amenity_id
        available
      }
      availability
      price
      created_at
      reviews {
        id
      }
      payments {
        id
      }
    }
  }
`;

export const EDIT_LISTING_MUTATION = gql`
  mutation EditListing($listingId: ID!, $listingData: listingInput) {
    updateListing(listingId: $listingId, listingData: $listingData) {
      address
      amenities {
        amenity_id
        available
      }
      availability
      contact_method
      created_at
      id
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      payments {
        id
      }
      price
      reviews {
        id
      }
      user_id
    }
  }
`;
