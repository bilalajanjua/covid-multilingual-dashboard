import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

import locales from "./locales";

export const TimeSeriesLineChart = ({ data, height, type }) => {
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
      type: "area",
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
      background: "#001529",
      defaultLocale: i18n.language,
      locales: locales
    },
    theme: {
      mode: "dark",
      palette: "palette7"
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
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
      shared: false,
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
    colors: ["#f5222d"]
  };
  return (
    <ReactApexChart
      options={options}
      series={[
        {
          name: `${t("chart.series.title.recorded")} ${type}`,
          data: data
        }
      ]}
      type="bar"
      height={350}
      ref={chartRef}
    />
  );
};
