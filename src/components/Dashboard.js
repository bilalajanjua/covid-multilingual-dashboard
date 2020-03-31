import moment from "moment";
import React, { useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { LineCharts } from "./charts/Linecharts";
import { SearchOutlined } from "@ant-design/icons";
import { getAllStats } from "../services/dashboard.service";
import * as countries from "i18n-iso-countries";

import {
  Col,
  Row,
  PageHeader,
  Card,
  Statistic,
  Table,
  Descriptions,
  Input,
  Tag,
  Button,
  Divider
} from "antd";
import { useTranslation } from "react-i18next";

const Dashboard = props => {
  const { loading, data } = useQuery(getAllStats);

  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [lineChartData, setLineChartData] = React.useState([]);
  const [duration, setDuration] = React.useState({
    cases: {
      from: "",
      to: ""
    },
    deaths: {
      from: "",
      to: ""
    }
  });

  const { t, i18n } = useTranslation();

  let searchInput = "";
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            searchInput = node;
          }}
          placeholder={t("dashboard.table.text.search.placeholder")}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {t("dashboard.table.text.search")}
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          {t("dashboard.table.text.reset")}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };
  const columns = [
    {
      title: t("dashboard.table.column.text.country"),
      dataIndex: "country",
      key: "country",
      width: 120,
      ...getColumnSearchProps("country"),
      render: (text, record) => {
        return (
          <span>
            <img src={record.countryInfo.flag} alt={text} width="18px" />{" "}
            <h4
              style={{
                display: "inline"
              }}
            >
              {countries.getName(record.countryInfo.iso2, i18n.language)}
            </h4>
          </span>
        );
      }
    },
    {
      title: t("searchByCountry.text.totalCases"),
      dataIndex: "cases",
      key: "cases",
      width: 100,
      sorter: (a, b) => a.cases - b.cases,
      render: text => <span className="number">{text}</span>
    },
    {
      title: t("searchByCountry.text.totalDeaths"),
      dataIndex: "deaths",
      key: "deaths",
      width: 100,
      sorter: (a, b) => a.deaths - b.deaths,
      render: text => <span className="number">{text}</span>
    },
    {
      title: t("searchByCountry.text.recoveredCases"),
      dataIndex: "recovered",
      key: "recovered",
      width: 100,
      sorter: (a, b) => a.recovered - b.recovered,
      render: text => <span className="number">{text}</span>
    },
    {
      title: t("searchByCountry.text.activeCases"),
      dataIndex: "active",
      key: "active",
      width: 100,
      sorter: (a, b) => a.active - b.active,
      render: text => <span className="number">{text}</span>
    },
    {
      title: t("searchByCountry.text.criticalCases"),
      dataIndex: "critical",
      key: "critical",
      width: 100,
      sorter: (a, b) => a.critical - b.critical,
      render: text => <span className="number">{text}</span>
    }
  ];

  useEffect(() => {
    if (data) {
      const cases = data.worldwideHistoricalData.cases.map(x => {
        return {
          x: new Date(x.date).getTime(),
          y: x.count
        };
      });
      const death = data.worldwideHistoricalData.deaths.map(x => {
        return {
          x: new Date(x.date).getTime(),
          y: x.count
        };
      });
      const recovered = data.worldwideHistoricalData.cases.map(x => {
        return {
          x: new Date(x.date).getTime(),
          y: data.all.recovered
        };
      });

      const linedata = { cases, death, recovered };

      setLineChartData(linedata);

      const casesDuration = {
        from: new Date(data.worldwideHistoricalData.cases[0].date),
        to: new Date(data.worldwideHistoricalData.cases[cases.length - 1].date)
      };

      const deathsDuration = {
        from: new Date(data.worldwideHistoricalData.deaths[0].date),
        to: new Date(data.worldwideHistoricalData.deaths[death.length - 1].date)
      };

      setDuration({ cases: casesDuration, deaths: deathsDuration });
    }
  }, [data]);
  return (
    <MainLayout {...props}>
      <PageHeader
        title={t("dashboard.header.title")}
        subTitle={t("dashboard.header.subTitle")}
        avatar={{ src: "/assets/icons/virus.svg" }}
      />
      <Divider />
      <Row gutter={[16, 16]}>
        <>
          {loading && (
            <>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card loading />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card loading />
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card loading />
              </Col>
            </>
          )}
          {!loading && data && (
            <>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className="shadow">
                  <Statistic
                    title={t("searchByCountry.text.totalCases")}
                    value={data.all.cases}
                    valueStyle={{ color: "#5ba0c9", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className="shadow">
                  <Statistic
                    title={t("searchByCountry.text.recoveredCases")}
                    value={data.all.recovered}
                    valueStyle={{ color: "#3f8600", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className="shadow">
                  <Statistic
                    title={t("searchByCountry.text.totalDeaths")}
                    value={data.all.deaths}
                    valueStyle={{ color: "#c06956", fontSize: "30px" }}
                  />
                </Card>
              </Col>
            </>
          )}
        </>
      </Row>

      {loading && (
        <div style={{ textAlign: "center" }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card loading />
            </Col>
          </Row>
        </div>
      )}
      {!loading && data && (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              title={
                <PageHeader
                  title={t("dashboard.card.title.coronaConfirmedCases&Deaths")}
                  extra={[
                    <Tag key="duration" color="blue">
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
              <LineCharts data={lineChartData} />
            </Card>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            className="shadow"
            title={<PageHeader title={t("dashboard.card.title.table")} />}
          >
            {loading && <Card loading />}
            {!loading && data && (
              <Table
                rowKey={"country"}
                columns={columns}
                pagination={false}
                expandable={{
                  expandedRowRender: record => (
                    <>
                      <Descriptions
                        title={t("dashboard.table.text.statisticalInfo")}
                        layout="vertical"
                        bordered
                      >
                        <Descriptions.Item
                          label={t("dashboard.table.text.casesPerMillion")}
                        >
                          <span className="number">
                            {record.casesPerOneMillion}
                          </span>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t("dashboard.table.text.deathsPerMillion")}
                        >
                          <span className="number">
                            {record.deathsPerOneMillion}
                          </span>
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  )
                }}
                dataSource={data.countries}
                scroll={{
                  x: true,
                  y: 600
                }}
                summary={() => {
                  let totalCases = 0;
                  let totalDeaths = 0;
                  let totalRecovered = 0;
                  let totalActive = 0;
                  let totalCritical = 0;

                  data.countries.forEach(
                    ({ cases, deaths, recovered, active, critical }) => {
                      totalCases += cases;
                      totalDeaths += deaths;
                      totalRecovered += recovered;
                      totalActive += active;
                      totalCritical += critical;
                    }
                  );

                  return (
                    <>
                      <tr className="table-summary">
                        <th>{t("dashboard.table.text.summary")}</th>
                        <td>
                          <span>
                            <b>
                              {data.countries.length}{" "}
                              {t("dashboard.table.text.countries")}
                            </b>
                          </span>
                        </td>
                        <td>
                          <span>
                            <b>{totalCases}</b>
                          </span>
                        </td>
                        <td>
                          <span>
                            <b>{totalDeaths}</b>
                          </span>
                        </td>
                        <td>
                          <span>
                            <b>{totalRecovered}</b>
                          </span>
                        </td>
                        <td>
                          <span>
                            <b>{totalActive}</b>
                          </span>
                        </td>
                        <td>
                          <span>
                            <b>{totalCritical}</b>
                          </span>
                        </td>
                      </tr>
                    </>
                  );
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;
