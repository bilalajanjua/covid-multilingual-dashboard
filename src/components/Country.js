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
import { TimeSeriesLineChart } from "./charts/TimeSeriesLineChart";

function Country(props) {
  const { name } = props.match.params;

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

  const ShowError = () => (
    <Result
      status="500"
      title="Internal Server Error"
      subTitle="Sorry, there was an error while fetching the data from server. Please try reloading the page!."
      extra={
        <Button type="primary">
          <Link to="/search">View All Countries</Link>
        </Button>
      }
    />
  );

  const GetChartProps = type => {
    const timeline = data.historicalStats.timeline[type];
    const timelineKeys = Object.keys(timeline);
    const chartData = timelineKeys.map(date => {
      return {
        x: moment(new Date(date)).format("YYYY-MM-DD"),
        y: timeline[date]
      };
    });

    return {
      data: [
        {
          id: `${type}-data`,
          data: chartData
        }
      ]
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
            title={data.generalStats.country}
            avatar={{
              src: data.generalStats.countryInfo.flag,
              shape: "square"
            }}
            subTitle={`View Details of Coronavirus Spread in ${data.generalStats.country}`}
            tags={[
              <Tag color="red" key="totalCasesTag">
                Total Cases: {data.generalStats.cases}
              </Tag>
            ]}
          />
          <Divider />
          <Row gutter={16} style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Today's Cases"
                  value={data.generalStats.todayCases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Today's Deaths"
                  value={data.generalStats.todayDeaths}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Critical Cases"
                  value={data.generalStats.critical}
                  precision={0}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Active Cases"
                  value={data.generalStats.active}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Total Cases"
                  value={data.generalStats.cases}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Total Deaths"
                  value={data.generalStats.deaths}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Recovered Cases"
                  value={data.generalStats.recovered}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="shadow">
                <Statistic
                  title="Deaths Per Million"
                  value={data.generalStats.deathsPerOneMillion}
                  precision={0}
                  suffix="per Million"
                />
              </Card>
            </Col>
          </Row>
          <Divider />
          <Card
            title={
              <PageHeader
                title={`Total Cases in ${data.generalStats.country}`}
                extra={[
                  <Tag key="duration">
                    <b>
                      Duration: {moment(duration["cases"].from).format("LL")} -{" "}
                      {moment(duration["cases"].to).format("LL")}
                    </b>
                  </Tag>
                ]}
              />
            }
            className="shadow"
          >
            <TimeSeriesLineChart
              {...GetChartProps("cases")}
              height={500}
              type="Cases"
            />
          </Card>
          <Divider />
          <Card
            title={
              <PageHeader
                title={`Total Deaths in ${data.generalStats.country}`}
                extra={[
                  <Tag key="duration">
                    <b>
                      Duration: {moment(duration["deaths"].from).format("LL")} -{" "}
                      {moment(duration["deaths"].to).format("LL")}
                    </b>
                  </Tag>
                ]}
              />
            }
            className="shadow"
          >
            <TimeSeriesLineChart
              {...GetChartProps("deaths")}
              height={500}
              type="Deaths"
            />
          </Card>
        </div>
      )}
      {!loading && data && !data.generalStats.country && ShowError()}
      {!loading && error && ShowError()}
    </MainLayout>
  );
}

export default Country;
