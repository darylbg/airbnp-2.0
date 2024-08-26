import { gql } from "@apollo/client";

export const GET_ALL_USER_NOTIFICATIONS_QUERY = gql`
  query GetAllUserNotifications($userId: ID!) {
    getAllUserNotifications(userId: $userId) {
      notification_status
      notification_text
      notification_type
      receiver {
        first_name
        email
        average_rating {
          count
          value
        }
        display_name
        id
        last_name
        user_image
      }
      reference_id
      reference_type
      sender {
        first_name
        email
        user_image
        last_name
        id
        display_name
        average_rating {
          value
          count
        }
      }
      reference {
        ... on Review {
          listing_id
          rating_text
          createdAt
          id
          rating_value
          review_type
          reviewed_user_id
          updatedAt
        }
        ... on Booking {
          arrival_time
          booking_status
          booking_status_updated_at
          created_at
          guest_id
          host_id
          id
          listing_url
          listing {
            id
            fullAddress
          }
          number_of_people
          payment_status
          special_requests
          total_price
        }
      }
      id
    }
  }
`;
