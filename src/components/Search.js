import React, { useState, useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import {
  PageHeader,
  Divider,
  Select,
  Spin,
  Result,
  Card,
  Avatar,
  Tag,
  Row,
  Col
} from "antd";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNTRIES_LIST } from "../services/search.service";

const { Option } = Select;

const gridStyle = {
  width: "100%",
  textAlign: "center",
  cursor: "pointer"
};

function Search(props) {
  const [selectedSortTitle, setSortTitle] = useState("Today's Cases");

  const [selectedSortValue, setSortValue] = useState("todayCases");

  const { loading, data, error, refetch } = useQuery(GET_COUNTRIES_LIST);

  useEffect(() => {
    refetch({
      criteria: selectedSortValue
    });
  }, [selectedSortValue, refetch]);

  const onCountrySelection = country => {
    props.history.push(`/country/${country}`);
  };

  const onSortSelect = sortBy => {
    const [title, criteria] = sortBy.split(",");
    setSortTitle(title);
    setSortValue(criteria);
  };
  return (
    <MainLayout {...props}>
      <PageHeader
        title="Search By Country"
        subTitle="Filter the Reports of Coronavirus Spread by Country"
        avatar={{ src: "/assets/icons/world.svg" }}
        tags={
          data
            ? [
                <Tag key="totalCountriesTag" color={"blue"}>
                  Total Countries: {data.countries.length}
                </Tag>
              ]
            : null
        }
      />
      <Divider />
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin spinning tip="Loading Countries Data...">
            <Card style={{ marginTop: "20px" }} loading></Card>
            <Card style={{ marginTop: "20px" }} loading></Card>
            <Card style={{ marginTop: "20px" }} loading></Card>
          </Spin>
        </div>
      )}
      {!loading && data && (
        <div>
          <Row>
            <Col xs={24} sm={12} md={16}>
              <label>
                <b>Search Country:</b>
              </label>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Country..."
                optionFilterProp="children"
                onSelect={onCountrySelection}
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
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
            </Col>
            <Col xs={24} sm={12} md={8}>
              <label>
                <b>Sort Countries:</b>
              </label>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Sorting Criteria..."
                optionFilterProp="children"
                onSelect={onSortSelect}
                filterOption={(input, option) =>
                  option.value
                    .split(",")[0]
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                defaultValue={`${selectedSortTitle},${selectedSortValue}`}
              >
                <Option value={"Today's Cases,todayCases"}>
                  Today's Cases
                </Option>
                <Option value={"Today's Deaths,todayDeaths"}>
                  Today's Deaths
                </Option>
                <Option value={"Total Cases,cases"}>Total Cases</Option>
                <Option value={"Total Deaths,deaths"}>Total Deaths</Option>
                <Option value={"Recovered Cases,recovered"}>
                  Recovered Cases
                </Option>
                <Option value={"Active Cases,active"}>Active Cases</Option>
                <Option value={"Critical Cases,critical"}>
                  Critical Cases
                </Option>
                <Option value={"Cases Per One Million,casesPerOneMillion"}>
                  Cases Per One Million
                </Option>
                <Option value={"Deaths Per One Million,deathsPerOneMillion"}>
                  Deaths Per One Million
                </Option>
              </Select>
            </Col>
          </Row>
          <Card style={{ marginTop: "20px" }}>
            <p style={{ textAlign: "center" }}>
              Showing <b>Top 24 Countries</b> based on the number of{" "}
              <b>{selectedSortTitle}</b> due to <b>COVID19</b>. Select a country
              from below or search above to view the details.
            </p>
            <Divider />
            <Row>
              {data.countries.slice(0, 24).map(country => (
                <Col xs={24} sm={12} md={6} xl={4} key={country.country}>
                  <Card.Grid
                    style={gridStyle}
                    onClick={() => onCountrySelection(country.country)}
                  >
                    <Avatar
                      shape="square"
                      size={18}
                      src={country.countryInfo.flag}
                    />
                    <h2>{country.country}</h2>
                    <Tag color={"blue"}>
                      {selectedSortTitle}: {country[selectedSortValue]}
                    </Tag>
                  </Card.Grid>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}
      {!loading && error && (
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
