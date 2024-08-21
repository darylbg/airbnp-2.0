import { gql, useMutation } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation CreateBooking($bookingInput: bookingInput) {
    createBooking(bookingInput: $bookingInput) {
      id
      host_id
      guest_id
      total_price
      special_requests
      payment_status
      number_of_people
      listing_url
      listing {
        id
        listing_title
        fullAddress
      }
      created_at
      booking_status_updated_at
      booking_status
      arrival_time
    }
  }
`;

export const UPDATE_BOOKING_MUTATION = gql`
  mutation UpdateBooking($bookingId: ID!, $bookingInput: bookingInput) {
    updateBooking(bookingId: $bookingId, bookingInput: $bookingInput) {
      arrival_time
      booking_status
      booking_status_updated_at
      created_at
      guest_id
      host_id
      id
      listing {
        id
        listing_title
        fullAddress
      }
      listing_url
      number_of_people
      payment_status
      special_requests
      total_price
    }
  }
`;
