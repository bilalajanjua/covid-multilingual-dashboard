import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

import locales from "./locales";

export const CountryLineChart = ({ data, height, type }) => {
  const chartRef = useRef(null);
  const { t, i18n } = useTranslation();

  i18n.on("languageChanged", lang => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      chart.setLocale(lang);
    }
  });

  const options = {
    chart: {
      type: "line",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom",
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      defaultLocale: i18n.language,
      locales: locales
    },
    theme: {
      mode: "light",
      palette: "palette4"
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      title: {
        text: type,
        style: {
          fontSize: "18px",
          fontFamily: t("site.font"),
          fontWeight: 400,
          cssClass: "apexcharts-yaxis-label"
        }
      }
    },
    xaxis: {
      type: "datetime"
    },
    tooltip: {
      shared: true,
      y: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      },
      style: {
        fontSize: "14px",
        fontFamily: t("site.font")
      }
    },
    colors: ["#5ba1c9", "#f52225"]
  };
  return (
    <ReactApexChart
      options={options}
      series={[
        {
          name: `${t("chart.series.title.recorded")} ${t(
            "chart.type.title.cases"
          )}`,
          data: data.cases
        },
        {
          name: `${t("chart.series.title.recorded")} ${t(
            "chart.type.title.deaths"
          )}`,
          data: data.deaths
        }
      ]}
      type="line"
      height={350}
      ref={chartRef}
    />
  );
};
