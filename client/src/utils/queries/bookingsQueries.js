import { gql } from "@apollo/client";

export const GET_USER_GUEST_RESERVATIONS = gql`
  query GetUserGuestReservations($userId: ID!) {
    getUserGuestReservations(user_id: $userId) {
        arrival_time
    booking_status
    booking_status_updated_at
    created_at
    guest_id
    host_id
    id
    listing {
      id
      fullAddress
      created_at
      contact_method
      availability
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id
    }
    listing_url
    number_of_people
    payment_status
    special_requests
    total_price
    }
  }
`;

export const GET_USER_BOOKING_HISTORY = gql`
  query GetUserBookingHistory($userId: ID!) {
    getUserBookingHistory(user_id: $userId) {
        arrival_time
    booking_status
    booking_status_updated_at
    created_at
    guest_id
    host_id
    id
    listing {
      id
      fullAddress
      created_at
      contact_method
      availability
      latitude
      listing_description
      listing_image
      listing_title
      longitude
      price
      user_id
    }
    listing_url
    number_of_people
    payment_status
    special_requests
    total_price
    }
  }
`;
