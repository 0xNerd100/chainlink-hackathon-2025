"use client"; // Add this if you're using Next.js App Router
import React, { useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
dayjs.extend(quarterOfYear);

// ✅ Dynamically import ApexChart to prevent SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const BarChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Sales",
        data: [
          { x: "Q1 2019", y: 400 },
          { x: "Q2 2019", y: 430 },
          { x: "Q3 2019", y: 448 },
          { x: "Q4 2019", y: 470 },
          { x: "Q1 2020", y: 540 },
          { x: "Q2 2020", y: 580 },
          { x: "Q3 2020", y: 690 },
          { x: "Q4 2020", y: 690 },
        ],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 380,
      },
      title: {
        text: "",
      },
      plotOptions: {
        bar: {
          distributed: true,
          colors: {
            backgroundBarColors: ["transparent"],
          },
        },
      },
      colors: ["#F3F5F8"], // White bars
      xaxis: {
        type: "category",
        labels: {
          show: false, // ❌ Hide bottom axis labels
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        group: {
          style: {
            fontSize: "10px",
            fontWeight: 700,
          },
          groups: [
            { title: "2019", cols: 4 },
            { title: "2020", cols: 4 },
          ],
        },
      },
      yaxis: {
        labels: {
          show: false, // ❌ Hide left labels
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: true, // ✅ Show horizontal grid lines
          },
        },
      },
      tooltip: {
        x: {
          formatter: () => "", // ❌ No date or label in tooltip
        },
      },
      legend: {
        show: false, // ❌ Hide legend/checkbox at bottom
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={380}
        />
      </div>
    </div>
  );
};

export default BarChart;
