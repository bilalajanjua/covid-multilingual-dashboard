import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "./config/routes.config";
import { ConfigProvider } from "antd";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider direction="ltr">
        <MainRoutes />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
