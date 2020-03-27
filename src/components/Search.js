import React from "react";
import MainLayout from "./shared/MainLayout";
import { PageHeader, Divider, Select, Spin } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { GET_COUNTRIES_LIST } from "../services/search.service";

const { Option } = Select;

function Search(props) {
  const { loading, data, error } = useQuery(GET_COUNTRIES_LIST);

  if (data) {
    console.log(data);
  }

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
          filterOption={(input, option) =>
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {data.countries.map((country, index) => {
            const name = country.country;
            const flag = country.countryInfo.flag;
            return (
              <Option value={name} key={name}>
                <img src={flag} alt={`${name}-icon`} width={18} height={18} />{" "}
                {name}
              </Option>
            );
          })}
        </Select>
      )}
    </MainLayout>
  );
}

export default Search;
