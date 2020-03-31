import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "./i18n";

import * as countries from "i18n-iso-countries";

import App from "./App";

import "antd/dist/antd.css";

const client = new ApolloClient({
  uri: "https://corona-graphql.herokuapp.com/"
});

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/ur.json"));

ReactDOM.render(
  <ApolloProvider client={client}>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </ApolloProvider>,
  document.getElementById("root")
);
