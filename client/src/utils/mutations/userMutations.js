import { gql } from "@apollo/client";

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($userData: userInput) {
    updateUser(userData: $userData) {
      display_name
      email
      first_name
      gender
      id
      last_name
      user_image
    }
  }
`;
