import React from "react";
import MainLayout from "./shared/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import { getAllCountries, getAllStats } from "../services/dashboard.service";
import {
  Col,
  Row,
  PageHeader,
  Card,
  Statistic,
  Table,
  Avatar,
  Descriptions,
  Input,
  Button
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const Dashboard = props => {
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const { loading, data, error } = useQuery(getAllStats);
  const {
    loading: loadingCountries,
    data: countryData,
    error: countryError
  } = useQuery(getAllCountries);
  let searchInput = '';
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
      render: (text, record) => (
        <span>
          <img src={record.countryInfo.flag} width="18px" />{" "}
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
      sorter: true,
    },
    {
      title: "Deaths",
      dataIndex: "deaths",
      key: "deaths",
      sorter: true,
    },
    {
      title: "Recovered",
      dataIndex: "recovered",
      key: "recovered"
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active"
    },
    {
      title: "Critical",
      dataIndex: "critical",
      key: "critical"
    }
  ];

  return (
    <MainLayout {...props}>
      <PageHeader
        title={"Covid19 Multilingual Dashboard"}
        subTitle={"Kuch BHI, ENglish aati hai"}
      />

      <Row gutter={[16, 16]}>
        <>
          {loading && (
            <>
              <Col span={8}>
                <Card loading />
              </Col>
              <Col span={8}>
                <Card loading />
              </Col>
              <Col span={8}>
                <Card loading />
              </Col>
            </>
          )}
          {!loading && data && (
            <>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Cases"
                    value={data.all.cases}
                    valueStyle={{ color: "#5ba0c9", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Recoverd"
                    value={data.all.recovered}
                    valueStyle={{ color: "#3f8600", fontSize: "30px" }}
                  />
                </Card>
              </Col>
              <Col span={8}>
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

      <Row>
        <Col span={24}>
          <h3> Overall Status by Province</h3>
          {loadingCountries && <Card loading />}
          {!loadingCountries && countryData && (
            <Table
              rowKey={"country"}
              columns={columns}
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
