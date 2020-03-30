import React from "react";
import ReactApexChart from "react-apexcharts";

export const LineCharts = ({ data }) => (
  <ReactApexChart
    options={{
      colors: ["#5aa2cf","#c06a5b","#3f8600"],
      stroke: {
        width: 3,
        curve: "straight",
        dashArray: [0, 0, 3]
      },
      chart: {
        type: "line",
        stacked: false,
        height: 450,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: "zoom"
        }
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0
      },
      title: {
        text: "Corona Confirmed Cases and Death",
        align: "left"
      },
      yaxis: [
        {
          min: 0,
          max: 1000000,
          tickAmount: 10,
          seriesName: "Total Cases",
          labels: {
            formatter: value => {
              var val = Math.abs(value);
              if (val >= 1000) {
                val = (val / 1000).toFixed(1) + " K";
              }
              return val;
            }
          }
        },
      ],
      xaxis: {
        type: "datetime",
        title: {
          text: "Time"
        }
      }
    }}
    series={data}
    type="line"
  />
);
