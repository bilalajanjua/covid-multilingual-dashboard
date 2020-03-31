import React from "react";
import { Layout, Menu, Divider, Button, Select, Tag } from "antd";
import { supportedLanguages } from "../../utils/supportedLanguages";
import { useTranslation } from "react-i18next";
import Helmet from "react-helmet";
import moment from "moment";
import { useQuery } from "react-apollo";
import { GET_LAST_UPDATED } from "../../services/main.service";

const { Header, Footer, Content } = Layout;

const { Option } = Select;

function MainLayout(props) {
  const pathname = props.match.path;

  const { t, i18n } = useTranslation();

  const { loading, data } = useQuery(GET_LAST_UPDATED);

  const onMenuSelect = ({ key }) => {
    props.history.push(key);
  };

  const handleLangChange = selectedLang => {
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("lang", selectedLang);
    moment.locale(selectedLang);
  };

  const ChangeLanguageUI = () => (
    <Select
      defaultValue={i18n.language}
      style={{ width: 120 }}
      onChange={handleLangChange}
      className="language-selector"
    >
      {supportedLanguages.map(language => (
        <Option value={language.value} key={language.name}>
          <img src={language.flag} width={18} /> {language.name}
        </Option>
      ))}
    </Select>
  );

  return (
    <React.Fragment>
      <Helmet>
        <link
          rel="stylesheet"
          href={`/assets/css/translations/${i18n.language}.css`}
        />
      </Helmet>
      <Layout className="layout">
        <Header
          id="main-header"
          style={{ display: "flex", direction: t("site.direction") }}
        >
          <div className="site-title">
            <h3>{t("site.title")}</h3>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[pathname]}
              onSelect={onMenuSelect}
              id="main-menu"
            >
              <Menu.Item key="/">{t("menu.dashboard")}</Menu.Item>
              <Menu.Item key="/search">{t("menu.searchByCountry")}</Menu.Item>
              <Menu.Item key="/map">{t("menu.map")}</Menu.Item>
            </Menu>
          </div>
          {!loading && data ? (
            <div>
              <Tag color="blue">
                Last Updated: {moment(data.all.updated).format("LLL")}
              </Tag>
            </div>
          ) : null}
          <div>{ChangeLanguageUI()}</div>
        </Header>
        <Content id="site-main-content">
          <div className="site-layout-content">{props.children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Covid19 Multilingual Dashboard © 2020
        </Footer>
      </Layout>
    </React.Fragment>
  );
}

export default MainLayout;
