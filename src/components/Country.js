import React from "react";
import MainLayout from "./shared/MainLayout";

function Country(props) {
  return (
    <MainLayout {...props}>
      <h4>Country Component</h4>
    </MainLayout>
  );
}

export default Country;
