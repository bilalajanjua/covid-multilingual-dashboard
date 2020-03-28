import { gql } from "apollo-boost";
export const getAllCountries = gql`
  query {
    countries {
      country
      countryInfo {
        flag
        _id
      }
      cases
      todayCases
      deaths
      todayDeaths
      recovered
      active
      critical
      casesPerOneMillion
      deathsPerOneMillion
    }
  }
`;
export const getAllStats = gql`
  query {
    all {
      cases
      deaths
      recovered
      updated
    }
  }
`;
