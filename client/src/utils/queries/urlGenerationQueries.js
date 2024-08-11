import { gql } from "@apollo/client";

export const GENERATE_TOKEN = gql`
  query GenerateToken {
    generateToken
  }
`;