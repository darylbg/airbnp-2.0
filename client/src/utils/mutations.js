import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
mutation Register($userData: userInput!, $password: String!) {
  register(userData: $userData, password: $password) {
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
        notifications
        reviews
        payments
        booking_history
        guest_reservations
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
          # user_id
          created_at
          listing_title
          listing_description
          listing_image
          price
          fullAddress
          addressLine1
          addressLine2
          addressCity
          addressRegion
          addressPostCode
          latitude
          longitude
          availability
          contact_method
          amenities {
            available
            name
            icon
          }
          payments {
            id
          }
          reviews
          average_rating {
            count
            value
          }
        }
        saved_listings {
          id
        }
        notifications
        reviews
        average_rating {
          count
          value
        }
        payments
        booking_history
        guest_reservations
        # booking_history {
        #   id
        # }
      }
    }
  }
`;

export const NEW_LISTING_MUTATION = gql`
  mutation CreateListing($listingData: listingInput) {
    createListing(listingData: $listingData) {
      id
      # user_id
      listing_title
      listing_description
      listing_image
      fullAddress
      addressLine1
      addressLine2
      addressCity
      addressRegion
      addressPostCode
      longitude
      latitude
      contact_method
      amenities {
        name
        icon
        available
      }
      availability
      price
      created_at
      reviews
      payments {
        id
      }
    }
  }
`;

export const EDIT_LISTING_MUTATION = gql`
  mutation EditListing($listingId: ID!, $listingData: listingInput) {
    updateListing(listingId: $listingId, listingData: $listingData) {
      fullAddress
      addressLine1
      addressLine2
      addressCity
      addressRegion
      addressPostCode
      amenities {
        name
        icon
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
      reviews
    }
  }
`;

export const DELETE_LISTING_MUTATION = gql`
  mutation DeleteListing($listingId: ID!) {
    deleteListing(listingId: $listingId) {
      user_listings {
        listing_title
        listing_image
        listing_description
        latitude
        id
        created_at
        contact_method
        availability
        amenities {
          amenity_id
        }
        fullAddress
        addressLine1
        addressLine2
        addressCity
        addressRegion
        addressPostCode
        longitude
        payments {
          id
        }
        price
        reviews
        # user_id {
        #   id
        # }
      }
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($amount: Int!) {
    createPaymentIntent(amount: $amount) {
      clientSecret
    }
  }
`;
