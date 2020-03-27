import React from "react";
import { Layout, Menu } from "antd";

const { Header, Footer, Content } = Layout;

function MainLayout(props) {
  const pathname = props.match.path;

  const onMenuSelect = ({ key }) => {
    props.history.push(key);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="site-title">
          <h3>Covid19 Statistics</h3>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[pathname]}
          onSelect={onMenuSelect}
        >
          <Menu.Item key="/">Dashboard</Menu.Item>
          <Menu.Item key="/search">Search By Country</Menu.Item>
          <Menu.Item key="/map">Map</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", minHeight: "85vh" }}>
        <div className="site-layout-content">{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Covid19 Multilingual Dashboard © 2020
      </Footer>
    </Layout>
  );
}

export default MainLayout;
