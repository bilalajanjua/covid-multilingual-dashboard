import { gql } from "apollo-boost";

export const GET_COUNTRIES_LIST = gql`
  query($criteria: String) {
    countries(sort: $criteria) {
      country
      countryInfo {
        flag
      }
      todayCases
      cases
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

export const GET_COUNTRY_STATS = gql`
  query($name: String!) {
    generalStats: country(name: $name) {
      country
      countryInfo {
        flag
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
    historicalStats: historicalByCountry(name: $name) {
      country
      province
      timeline {
        cases
        deaths
      }
    }
  }
`;
