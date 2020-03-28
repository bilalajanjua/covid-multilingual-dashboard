import React from "react";
import { ResponsiveCalendar } from "@nivo/calendar";

export const CalendarChart = ({ data, from, to, height }) => {
  return (
    <div style={{ height }}>
      <ResponsiveCalendar
        data={data}
        from={from} // "2015-03-01"
        to={to} // "2016-07-12"
        emptyColor="#eeeeee"
        colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
        minValue="auto"
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
        yearSpacing={35}
        yearLegendOffset={20}
        monthBorderColor="#ffffff"
        daySpacing={1}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        legends={[
          {
            anchor: "bottom-right",
            direction: "row",
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: "right-to-left"
          }
        ]}
      />
    </div>
  );
};
