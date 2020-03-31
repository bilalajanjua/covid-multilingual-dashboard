import moment from "moment";
import React, { useEffect } from "react";
import MainLayout from "./shared/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { LineCharts } from "./charts/Linecharts";
import { SearchOutlined } from "@ant-design/icons";
import { getAllStats } from "../services/dashboard.service";

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
  Spin,
  Divider
} from "antd";

const Dashboard = props => {
  const { loading, data, error } = useQuery(getAllStats);

  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [lineChartData, setLineChartData] = React.useState([]);

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
          placeholder={`Search ${dataIndex}`}
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
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
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
      title: "Country",
      dataIndex: "country",
      key: "country",
      fixed: "left",
      width: 120,
      render: (text, record) => (
        <span>
          <img src={record.countryInfo.flag} alt={text} width="18px" />{" "}
          <h4
            style={{
              display: "inline"
            }}
          >
            {text}
          </h4>
        </span>
      ),
      ...getColumnSearchProps("country")
    },
    {
      title: "Total Cases",
      dataIndex: "cases",
      key: "cases",
      width: 100,

      sorter: true
    },
    {
      title: "Deaths",
      dataIndex: "deaths",
      key: "deaths",
      width: 100,

      sorter: true
    },
    {
      title: "Recovered",
      dataIndex: "recovered",
      key: "recovered",
      width: 100
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: 100
    },
    {
      title: "Critical",
      dataIndex: "critical",
      key: "critical",
      width: 100
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
      const linedata = [
        {
          name: "Total Cases",
          data: cases
        },
        {
          name: "Total Deaths",
          data: death
        },
        {
          name: "Recovered Till Now",
          data: recovered
        }
      ];

      setLineChartData(linedata);
    }
  }, [data]);
  return (
    <MainLayout {...props}>
      <PageHeader
        title={"Covid19 Multilingual Dashboard"}
        subTitle={"Daily Updated Corona Virus Statistics"}
      />

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
                    title="Total Cases"
                    value={data.all.cases}
                    valueStyle={{ color: "#5ba0c9", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className="shadow">
                  <Statistic
                    title="Recoverd"
                    value={data.all.recovered}
                    valueStyle={{ color: "#3f8600", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className="shadow">
                  <Statistic
                    title="Deaths"
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
            <Card className="shadow">
              <LineCharts data={lineChartData} />
            </Card>
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card className="shadow" title="Overall Status by Province">
            {loading && <Card loading />}
            {!loading && data && (
              <Table
                rowKey={"country"}
                columns={columns}
                style={{ overflowX: "auto" }}
                expandable={{
                  expandedRowRender: record => (
                    <>
                      <Descriptions title="Statistical Info">
                        <Descriptions.Item label="Cases Per One Million">
                          {record.casesPerOneMillion}
                        </Descriptions.Item>
                        <Descriptions.Item label="Deaths Per One Million ">
                          {record.deathsPerOneMillion}
                        </Descriptions.Item>
                      </Descriptions>
                    </>
                  ),
                  rowExpandable: record => record.name !== "Not Expandable"
                }}
                dataSource={data.countries}
              />
            )}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;
