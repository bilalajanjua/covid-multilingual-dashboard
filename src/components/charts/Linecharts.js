import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import locales from "./locales";

export const LineCharts = ({ data }) => {
  const chartRef = useRef(null);
  const { t, i18n } = useTranslation();

  i18n.on("languageChanged", (lang) => {
    if (chartRef.current) {
      const chart = chartRef.current.chart;
      chart.setLocale(lang);
    }
  });

  return (
    <ReactApexChart
      ref={chartRef}
      options={{
        colors: ["#5aa2cf", "#c06a5b", "#3f8600"],
        stroke: {
          width: 3,
          curve: "straight",
          dashArray: [0, 0, 3],
        },
        theme: {
          mode: "light",
          palette: "palette4",
        },
        chart: {
          type: "line",
          stacked: false,
          height: 350,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
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
              reset: true,
            },
          },
          defaultLocale: i18n.language,
          locales: locales,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        yaxis: [
          {
            min: 0,
            tickAmount: 10,
            seriesName: "Total Cases",
            labels: {
              formatter: (value) => {
                var val = Math.abs(value);
                if (val >= 1000) {
                  val = (val / 1000).toFixed(1) + " K";
                }
                return val;
              },
            },
          },
        ],
        xaxis: {
          type: "datetime",
        },
        tooltip: {
          shared: true,
          y: {
            formatter: function (val) {
              return val.toLocaleString();
            },
          },
          style: {
            fontSize: "14px",
            fontFamily: t("site.font"),
          },
        },
      }}
      series={[
        {
          name: t("chart.series.title.totalCases"),
          data: data.cases,
        },
        {
          name: t("chart.series.title.totalDeaths"),
          data: data.death,
        },
        {
          name: t("chart.series.title.recoveredTillNow"),
          data: data.recovered,
        },
      ]}
      type="line"
      height={400}
    />
  );
};
