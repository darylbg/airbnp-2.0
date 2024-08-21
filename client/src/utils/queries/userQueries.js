import { gql } from "@apollo/client";

export const GET_USER_BY_ID_QUERY = gql`
query User($userId: ID!) {
  user(id: $userId) {
    created_at
    display_name
    email
    first_name
    gender
    id
    last_name
    user_image
  }
}`