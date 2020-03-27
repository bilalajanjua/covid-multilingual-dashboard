import { gql } from "apollo-boost";

export const GET_COUNTRIES_LIST = gql`
  query {
    countries {
      country
      countryInfo {
        flag
      }
    }
  }
`;
