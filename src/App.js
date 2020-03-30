import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "./config/routes.config";
import { ConfigProvider } from "antd";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import moment from "moment";

import "moment/locale/ur";

const currentLang = localStorage.getItem("lang") || "en";

moment.locale(currentLang);

function App() {
  const { t } = useTranslation();

  const direction = t("site.direction");

  return (
    <BrowserRouter>
      <ConfigProvider direction={direction}>
        <MainRoutes />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
