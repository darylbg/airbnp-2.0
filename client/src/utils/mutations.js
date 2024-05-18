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
      # reviews {
      #   created_at
      #   id
      #   listing_id
      #   rating_text
      #   rating_value
      #   user_id
      # }
      # payments {
      #   amount_paid
      #   created_at
      #   currency
      #   guest_quantity
      #   id
      #   listing_id
      #   payment_method
      #   payment_status
      #   user_id
      # }
      created_at
    }
  }
`;
