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
