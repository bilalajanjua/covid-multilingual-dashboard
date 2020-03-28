import React, { useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import {
  PageHeader,
  Divider,
  Select,
  Spin,
  Result,
  Row,
  Col,
  Card,
  Statistic
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import {
  GET_COUNTRIES_LIST,
  GET_COUNTRY_STATS
} from "../services/search.service";

const { Option } = Select;

function Search(props) {
  const defaultCountry = "Pakistan";

  const { loading, data, error } = useQuery(GET_COUNTRIES_LIST);

  const {
    loading: loadingCountry,
    data: countryStats,
    error: countryError,
    refetch: getCountryStats
  } = useQuery(GET_COUNTRY_STATS, {
    variables: {
      name: defaultCountry
    }
  });

  console.log("Country Stats: ", loadingCountry, countryStats, countryError);

  const onCountrySelection = country =>
    getCountryStats({ variables: { name: country } });

  return (
    <MainLayout {...props}>
      <PageHeader
        title="Search By Country"
        subTitle="Filter the Reports of Coronavirus Spread by Country"
        avatar={{ src: "/assets/icons/world.svg" }}
      />
      <Divider />
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin
            spinning={loading}
            tip="Loading Countries List..."
            style={{ marginTop: "30px" }}
          />
        </div>
      )}
      {!loading && data && (
        <Select
          showSearch
          style={{ width: "100%" }}
          placeholder="Select Country..."
          optionFilterProp="children"
          onSelect={onCountrySelection}
          filterOption={(input, option) =>
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          defaultValue={defaultCountry}
        >
          {data.countries.map((country, index) => {
            const name = country.country;
            const flag = country.countryInfo.flag;
            return (
              <Option value={name} key={name}>
                <img src={flag} alt={`${name}-icon`} width={18} /> {name}
              </Option>
            );
          })}
        </Select>
      )}
      {!loading && error && (
        <Result
          status="500"
          title="Internal Server Error"
          subTitle="Sorry, there was an error while fetching the data from server. Please try reloading the page!."
        />
      )}
      {loadingCountry && (
        <div style={{ textAlign: "center" }}>
          <Spin
            spinning={loadingCountry}
            tip="Loading Country Reports..."
            style={{ marginTop: "30px" }}
          />
        </div>
      )}
      {!loadingCountry && countryStats && (
        <div>
          <PageHeader
            avatar={{ src: countryStats.generalStats.countryInfo.flag }}
            title={countryStats.generalStats.country}
          />
          <Divider />
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Today's Cases"
                  value={countryStats.generalStats.todaysCases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Today's Deaths"
                  value={countryStats.generalStats.todayDeaths}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Critical Cases"
                  value={countryStats.generalStats.critical}
                  precision={0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Active Cases"
                  value={countryStats.generalStats.active}
                  precision={0}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Total Cases"
                  value={countryStats.generalStats.cases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Total Deaths"
                  value={countryStats.generalStats.active}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Recovered Cases"
                  value={countryStats.generalStats.recovered}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Deaths Per Million"
                  value={countryStats.generalStats.deathsPerOneMillion}
                  precision={0}
                  suffix="per Million"
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {!loadingCountry && countryError && (
        <Result
          status="500"
          title="Internal Server Error"
          subTitle="Sorry, there was an error while fetching the data from server. Please try reloading the page!."
        />
      )}
    </MainLayout>
  );
}

export default Search;
