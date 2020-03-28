import React from "react";
import { Layout, Menu, Divider } from "antd";

const { Header, Footer, Content } = Layout;

function MainLayout(props) {
  const pathname = props.match.path;

  const onMenuSelect = ({ key }) => {
    props.history.push(key);
  };

  return (
    <Layout className="layout">
      <Header id="main-header">
        <div className="site-title">
          <h3>Covid19 Statistics</h3>
        </div>
        <div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[pathname]}
            onSelect={onMenuSelect}
            id="main-menu"
          >
            <Menu.Item key="/">Dashboard</Menu.Item>
            <Menu.Item key="/search">Search By Country</Menu.Item>
            <Menu.Item key="/map">Map</Menu.Item>
          </Menu>
        </div>
      </Header>
      <Content id="site-main-content">
        <div className="site-layout-content">{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Covid19 Multilingual Dashboard © 2020
      </Footer>
    </Layout>
  );
}

export default MainLayout;
