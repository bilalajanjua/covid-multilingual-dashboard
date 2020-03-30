import { gql } from "apollo-boost";

export const GET_COUNTRIES_DATA = gql`
  query {
    countries {
      cases
      country
      todayCases
      deaths
      todayDeaths
      recovered
      active
      critical
      casesPerOneMillion
      deathsPerOneMillion
      countryInfo {
        lat
        long
      }
    }
  }
`;
