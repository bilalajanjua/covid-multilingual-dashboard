import { gql } from "apollo-boost";

export const GET_LAST_UPDATED = gql`
  query {
    all {
      updated
    }
  }
`;
