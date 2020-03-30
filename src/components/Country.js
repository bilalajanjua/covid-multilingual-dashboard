import React, { useState, useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNTRY_STATS } from "../services/search.service";
import {
  PageHeader,
  Divider,
  Skeleton,
  Row,
  Col,
  Card,
  Tag,
  Result,
  Button,
  Statistic
} from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { BarChart } from "./charts/BarChart";
import { useTranslation } from "react-i18next";
import * as countries from "i18n-iso-countries";
import { Show500Error } from "./shared/500Error";

function Country(props) {
  const { name } = props.match.params;

  const { t, i18n } = useTranslation();

  const [duration, setDuration] = useState({
    cases: {
      from: "",
      to: ""
    },
    deaths: {
      from: "",
      to: ""
    }
  });

  const { loading, data, error } = useQuery(GET_COUNTRY_STATS, {
    variables: {
      name
    }
  });

  useEffect(() => {
    if (data) {
      const timeline = data.historicalStats.timeline;
      const casesTimeline = Object.keys(timeline.cases);
      const deathsTimeline = Object.keys(timeline.deaths);

      const cases = {
        from: new Date(casesTimeline[0]),
        to: new Date(casesTimeline[casesTimeline.length - 1])
      };

      const deaths = {
        from: new Date(deathsTimeline[0]),
        to: new Date(deathsTimeline[deathsTimeline.length - 1])
      };

      setDuration({ cases, deaths });
    }
  }, [data]);

  const GetChartProps = () => {
    const casesTimeline = data.historicalStats.timeline["cases"];
    const casesTimelineKeys = Object.keys(casesTimeline);
    const cases = casesTimelineKeys.map(date => {
      return [new Date(date).getTime(), casesTimeline[date]];
    });

    const deathsTimeline = data.historicalStats.timeline["deaths"];
    const deathsTimelineKeys = Object.keys(deathsTimeline);
    const deaths = deathsTimelineKeys.map(date => {
      return [new Date(date).getTime(), deathsTimeline[date]];
    });

    return {
      data: { cases, deaths }
    };
  };

  return (
    <MainLayout {...props}>
      {loading && (
        <div>
          <Skeleton avatar active title paragraph={{ rows: 0 }} />
          <Divider />
          <Row>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card loading></Card>
            </Col>
          </Row>
          <Divider />
          <Skeleton active />
        </div>
      )}
      {!loading && data && data.generalStats.country && (
        <div>
          <PageHeader
            title={countries.getName(
              data.generalStats.countryInfo.iso2,
              i18n.language
            )}
            avatar={{
              src: data.generalStats.countryInfo.flag,
              shape: "square"
            }}
            subTitle={
              t("site.direction") === "ltr"
                ? `${t("country.header.subtitle")} ${countries.getName(
                    data.generalStats.countryInfo.iso2,
                    i18n.language
                  )}`
                : `${countries.getName(
                    data.generalStats.countryInfo.iso2,
                    i18n.language
                  )} ${t("country.header.subtitle")}`
            }
            tags={[
              <Tag color="red" key="totalCasesTag">
                {t("country.text.totalCases")}{" "}
                <span className="number">{data.generalStats.cases}</span>
              </Tag>
            ]}
          />
          <Divider />
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.todayCases")}
                  value={data.generalStats.todayCases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.todayDeaths")}
                  value={data.generalStats.todayDeaths}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.criticalCases")}
                  value={data.generalStats.critical}
                  precision={0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.activeCases")}
                  value={data.generalStats.active}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.totalCasesTitle")}
                  value={data.generalStats.cases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.totalDeaths")}
                  value={data.generalStats.deaths}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.recoveredCases")}
                  value={data.generalStats.recovered}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Card className="shadow">
                <Statistic
                  title={t("country.text.deathsPerMillion")}
                  value={data.generalStats.deathsPerOneMillion}
                  precision={0}
                  suffix={t("country.text.perMillion")}
                />
              </Card>
            </Col>
          </Row>
          <Divider />
          <Card
            title={
              <PageHeader
                title={
                  t("site.direction") === "ltr"
                    ? `${t(
                        "country.card.title.totalCasesAndDeaths"
                      )} ${countries.getName(
                        data.generalStats.countryInfo.iso2,
                        i18n.language
                      )}`
                    : `${countries.getName(
                        data.generalStats.countryInfo.iso2,
                        i18n.language
                      )} ${t("country.card.title.totalCasesAndDeaths")}`
                }
                extra={[
                  <Tag key="duration">
                    <b>
                      {t("country.text.duration")}{" "}
                      {moment(duration["cases"].from).format("LL")} -{" "}
                      {moment(duration["cases"].to).format("LL")}
                    </b>
                  </Tag>
                ]}
              />
            }
            className="shadow"
            style={{ direction: "ltr" }}
          >
            <BarChart {...GetChartProps()} height={500} />
          </Card>
        </div>
      )}
      {!loading && data && !data.generalStats.country && <Show500Error />}
      {!loading && error && <Show500Error />}
    </MainLayout>
  );
}

export default Country;
