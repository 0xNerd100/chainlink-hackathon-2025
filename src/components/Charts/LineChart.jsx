import React, { useState } from "react";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";

const ProductTrendLineChart = ({ series }) => {
  const [chartConfig, setChartConfig] = useState({
    series: series,
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
        background: "transparent", // No background
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth", // ✅ Curvy lines
        colors: ["#FFFFFF"],
        width: 2, // Thinner line
      },
      title: {
        text: "",
        align: "left",
      },
      grid: {
        row: {
          colors: ["transparent", "transparent"], // No row striping
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ["4/06/25", "4/13/25", "4/20/25", "4/27/25"],
        labels: {
          style: {
            colors: "#DDDDDD",
          },
        },
        axisBorder: {
          show: true,
          color: "#DDDDDD", // Bottom border color
          height: 1, // Thickness
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#DDDDDD",
          },
          formatter: (val) => `$${val}M`,
        },
        axisBorder: {
          show: true,
          color: "#DDDDDD", // Left border color
          width: 1, // Thin line
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: "dark",
      },
      legend: {
        show: false,
        // labels: {
        //   colors: "#DDDDDD",
        // },
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartConfig.options}
          series={chartConfig.series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

// Mount the component (example only if you're rendering it in plain HTML)
const domContainer = document.querySelector("#app");
if (domContainer) {
  ReactDOM.render(<ProductTrendLineChart />, domContainer);
}

export default ProductTrendLineChart;
