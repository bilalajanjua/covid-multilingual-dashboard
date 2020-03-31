import React, { useState, useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import {
  PageHeader,
  Divider,
  Select,
  Spin,
  Card,
  Avatar,
  Tag,
  Row,
  Col
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNTRIES_LIST } from "../services/search.service";
import { useTranslation } from "react-i18next";
import * as countries from "i18n-iso-countries";
import { Show500Error } from "./shared/500Error";

const { Option } = Select;

const gridStyle = {
  width: "100%",
  textAlign: "center",
  cursor: "pointer"
};

function Search(props) {
  const { t, i18n } = useTranslation();

  const [selectedSortTitle, setSortTitle] = useState(
    "searchByCountry.text.todayCases"
  );

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
        title={t("searchByCountry.text.title")}
        subTitle={t("searchByCountry.text.subtitle")}
        avatar={{
          icon: <SearchOutlined />,
          style: {
            background: "none",
            color: "black"
          }
        }}
        tags={
          data
            ? [
                <Tag key="totalCountriesTag" color={"blue"}>
                  {t("searchByCountry.text.totalCountries")}{" "}
                  <span className="number">{data.countries.length}</span>
                </Tag>
              ]
            : null
        }
      />
      <Divider />
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin spinning>
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
                <b>{t("searchByCountry.label.searchCountry")}</b>
              </label>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder={t("searchByCountry.label.selectCountry")}
                optionFilterProp="children"
                onSelect={onCountrySelection}
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {data.countries.map((country, index) => {
                  const name = country.country;
                  const flag = country.countryInfo.flag;
                  const iso2 = country.countryInfo.iso2;
                  return (
                    <Option value={name} key={name}>
                      <img src={flag} alt={`${name}-icon`} width={18} />{" "}
                      {countries.getName(iso2, i18n.language)}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <label>
                <b>{t("searchByCountry.label.sortCountries")}</b>
              </label>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Sorting Criteria..."
                optionFilterProp="children"
                onSelect={onSortSelect}
                filterOption={(input, option) =>
                  t(option.value.split(",")[0])
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                defaultValue={`${selectedSortTitle},${selectedSortValue}`}
              >
                <Option value={"searchByCountry.text.todayCases,todayCases"}>
                  {t("searchByCountry.text.todayCases")}
                </Option>
                <Option value={"searchByCountry.text.todayDeaths,todayDeaths"}>
                  {t("searchByCountry.text.todayDeaths")}
                </Option>
                <Option value={"searchByCountry.text.totalCases,cases"}>
                  {t("searchByCountry.text.totalCases")}
                </Option>
                <Option value={"searchByCountry.text.totalDeaths,deaths"}>
                  {t("searchByCountry.text.totalDeaths")}
                </Option>
                <Option value={"searchByCountry.text.recoveredCases,recovered"}>
                  {t("searchByCountry.text.recoveredCases")}
                </Option>
                <Option value={"searchByCountry.text.activeCases,active"}>
                  {t("searchByCountry.text.activeCases")}
                </Option>
                <Option value={"searchByCountry.text.criticalCases,critical"}>
                  {t("searchByCountry.text.criticalCases")}
                </Option>
                <Option
                  value={
                    "searchByCountry.text.casesPerMillion,casesPerOneMillion"
                  }
                >
                  {t("searchByCountry.text.casesPerMillion")}
                </Option>
                <Option
                  value={
                    "searchByCountry.text.deathsPerMillion,deathsPerOneMillion"
                  }
                >
                  {t("searchByCountry.text.deathsPerMillion")}
                </Option>
              </Select>
            </Col>
          </Row>
          <Card style={{ marginTop: "20px" }}>
            <p className="card-helper" style={{ textAlign: "center" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("searchByCountry.text.helper.1")
                }}
              ></span>{" "}
              <b>{t(selectedSortTitle)}</b>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: t("searchByCountry.text.helper.2")
                }}
              ></span>
            </p>
            <Divider />
            <Row>
              {data.countries.slice(0, 24).map(country => (
                <Col xs={12} sm={12} md={6} xl={4} key={country.country}>
                  <Card.Grid
                    style={gridStyle}
                    onClick={() => onCountrySelection(country.country)}
                  >
                    <Avatar
                      shape="square"
                      size={18}
                      src={country.countryInfo.flag}
                    />
                    <h2>
                      {countries.getName(
                        country.countryInfo.iso2,
                        i18n.language
                      )}
                    </h2>
                    <Tag color={"blue"}>
                      {t(selectedSortTitle)}:{" "}
                      <span className="number">
                        {country[selectedSortValue]}
                      </span>
                    </Tag>
                  </Card.Grid>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}
      {!loading && error && <Show500Error />}
    </MainLayout>
  );
}

export default Search;
