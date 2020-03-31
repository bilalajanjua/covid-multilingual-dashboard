import { gql } from "apollo-boost";

export const getAllStats = gql`
  query {
    all {
      cases
      deaths
      recovered
      updated
    }
    countries {
      country
      countryInfo {
        flag
        _id
        iso2
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
    worldwideHistoricalData {
      cases {
        date
        count
      }
      deaths {
        date
        count
      }
    }
  }
`;
