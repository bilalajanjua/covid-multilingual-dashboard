import React from "react";
import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from "./config/routes.config";

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
}

export default App;
