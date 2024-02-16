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
        user_listings
        saved_listings
        notifications
        reviews
        payments
        booking_history
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        display_name
        email
        first_name
        gender
        id
        last_name
        user_image
        notifications {
          id
        }
        payments {
          id
        }
        reviews {
          id
        }
        saved_listings {
          id
        }
        user_listings {
          id
        }
      }
    }
  }
`;
