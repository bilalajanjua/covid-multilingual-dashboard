import React from "react";
import { ResponsiveLine } from "@nivo/line";

export const LineCharts = ({ data }) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{
      type: "time",
      format: "%Y-%m-%d",
      precision: "day"
    }}
    xFormat="time:%Y-%m-%d"
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: false,
      reverse: false
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: "bottom",
      tickSize: 5,
      tickPadding: 5,
      legend: "days",
      legendOffset: 36,
      legendPosition: "middle",
      format: "%b %d",
      tickValues: "every 5 days",
      tickRotation: 20
    }}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "count",
      legendOffset: -55,
      legendPosition: "middle"
    }}
    colors={{ scheme: "nivo" }}
    pointSize={10}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabel="Deaths"
    pointLabelYOffset={-12}
    useMesh={true}
    legends={[
      {
        anchor: "bottom-right",
        direction: "row",
        justify: false,
        translateX: 100,
        translateY: 55,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 90,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1
            }
          }
        ]
      }
    ]}
    enableSlices="x"
    sliceTooltip={({ slice }) => {
      console.log(slice);
      return (
        <div
          style={{
            background: "white",
            padding: "9px 12px",
            border: "1px solid #ccc"
          }}
        >
          <div
            style={{
              textAlign: "left"
            }}
          >
            Date: {slice.points[0].data.xFormatted}
          </div>
          {slice.points.map(point => (
            <div
              key={point.id}
              style={{
                color: point.serieColor,
                padding: "3px 0"
              }}
            >
              <strong>{point.serieId}</strong> [{point.data.yFormatted}]
            </div>
          ))}
        </div>
      );
    }}
  />
);
