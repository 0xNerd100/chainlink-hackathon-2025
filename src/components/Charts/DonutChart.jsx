"use client";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";

const DonutChart = () => {
  const [series] = useState([10, 10, 80]);
  const labels = ["Owner wallet", "Pre-sell ", "Lock for 1 year"];
  const colors = ["#FF007A", "#3EA2FF", "#F0B90B"];
  const options = {
    chart: {
      type: "donut",
      background: "transparent",
      foreColor: "#ffffff",
    },
    labels,
    colors,
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        expandOnClick: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#ffffff"],
      },
    },
    fill: {
      type: "gradient",
    },
    stroke: {
      show: false,
    },
    title: {
      text: "",
      style: {
        color: "#ffffff",
      },
    },
    legend: {
      show: false, // hide default legend
    },
    tooltip: {
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <ChartWrpper
      className="flex items-center gap-4 flex-wrap sm:flex-nowrap"
      style={{ width: "100%" }}
    >
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height="350"
      />
      <div className="flex flex-col gap-4 max-w-[max-content]">
        {labels?.map((label, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="h-[14px] w-[14px] rounded-full"
              style={{
                backgroundColor: colors[index],
              }}
            />
            <div className="content">
              <div className="whitespace-nowrap">{label}</div>
              <h2 className="m-0 font-bold text-[20px]">{series[index]}%</h2>
            </div>
          </div>
        ))}
      </div>
    </ChartWrpper>
  );
};

const ChartWrpper = styled.div`
  > div:first-child {
    width: 100%;
  }
`;

export default DonutChart;
