import React from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";

export const TimeSeriesLineChart = ({ data, height, type }) => {
  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
        colors={{ scheme: "nivo" }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          precision: "day"
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          stacked: true
        }}
        axisLeft={{
          legend: `Total ${type}`,
          legendOffset: 12
        }}
        axisBottom={{
          format: "%b %d",
          tickValues: "every 4 days",
          legend: "Date",
          legendOffset: -12,
          tickSize: 11,
          tickRotation: 85
        }}
        animate={true}
        enableSlices={"x"}
        pointSize={6}
        pointBorderWidth={1}
        pointBorderColor={{
          from: "color",
          modifiers: [["darker", 0.3]]
        }}
        useMesh={true}
        enableSlices={false}
        curve="natural"
        enableArea={true}
        tooltip={({ point }) => {
          const { data } = point;
          return (
            <span
              style={{
                padding: "5px",
                background: "white",
                textAlign: "center"
              }}
              className="shadow"
            >
              <b>
                Total {data.y} {type} recorded on {moment(data.x).format("LL")}
              </b>
            </span>
          );
        }}
      />
    </div>
  );
};
