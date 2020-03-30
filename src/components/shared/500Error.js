import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Result, Button } from "antd";

export const Show500Error = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="500"
      title={t("result.500.title")}
      subTitle={t("result.500.subTitle")}
      extra={
        <Button type="primary">
          <Link to="/search">{t("country.text.viewAllCountries")}</Link>
        </Button>
      }
    />
  );
};
