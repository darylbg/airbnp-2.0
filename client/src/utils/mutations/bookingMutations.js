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
