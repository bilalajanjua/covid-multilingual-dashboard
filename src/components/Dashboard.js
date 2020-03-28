import React, { useEffect } from "react";
import moment from "moment";
import MainLayout from "./shared/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { LineCharts } from "./charts/Linecharts";
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
import {
  getAllCountries,
  getAllStats,
  getHistoricalData
} from "../services/dashboard.service";
const Dashboard = props => {
  const { loading, data, error } = useQuery(getAllStats);
  const {
    loading: loadingLines,
    data: dataLines,
    error: errorLines
  } = useQuery(getHistoricalData);

  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const [lineChartData, setLineChartData] = React.useState([]);
  const {
    loading: loadingCountries,
    data: countryData,
    error: countryError
  } = useQuery(getAllCountries);
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
    if (dataLines) {
      const cases = dataLines.worldwideHistoricalData.cases.map(x => {
        return {
          x: x.date,
          y: x.count
        };
      });
      const death = dataLines.worldwideHistoricalData.cases.map(x => {
        return {
          x: x.date,
          y: x.count
        };
      });

      const linedata = [
        {
          id: "totalCases",
          color: "hsl(309, 70%, 50%)",
          data: cases
        },
        {
          id: "death",
          color: "hsl(355, 70%, 50%)",
          data: death
        }
      ];

      setLineChartData(linedata);
    }
  }, [dataLines]);
  return (
    <MainLayout {...props}>
      <PageHeader
        title={"Covid19 Multilingual Dashboard"}
        subTitle={"Kuch BHI, ENglish aati hai"}
      />
      {!loading && data && (
        <Divider orientation="left">
          <Tag color="green">
            Updated: {moment(data.all.updated).format("DD MMMM YYYY hh:mm a")}
          </Tag>
        </Divider>
      )}
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
                <Card>
                  <Statistic
                    title="Total Cases"
                    value={data.all.cases}
                    valueStyle={{ color: "#5ba0c9", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card>
                  <Statistic
                    title="Recoverd"
                    value={data.all.recovered}
                    valueStyle={{ color: "#3f8600", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card>
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

      {loadingLines && (
        <div style={{ textAlign: "center", height: "100px" }}>
          <Spin />
        </div>
      )}
      {!loadingLines && dataLines && (
        <div style={{ textAlign: "center", height: "650px" }}>
          <LineCharts data={lineChartData} />
        </div>
      )}
      <Row>
        <Col span={24}>
          <h3> Overall Status by Province</h3>
          {loadingCountries && <Card loading />}
          {!loadingCountries && countryData && (
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
              dataSource={countryData.countries}
            />
          )}
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Dashboard;
