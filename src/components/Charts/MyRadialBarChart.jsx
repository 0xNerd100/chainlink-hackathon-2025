import React from "react";
import ReactApexChart from "react-apexcharts";

const MyRadialBarChart = () => {
  const colors = ["#F30A34"];
  const options = {
    chart: {
      toolbar: {
        show: false, // set to false to hide entire toolbar
        tools: {
          download: false, // disable download button
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
      height: 350,
      type: "radialBar",
      //   toolbar: { show: true },
      background: "transparent",
      foreColor: "#fff",
    },
    colors,
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff", // white hollow background
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.5,
          },
        },
        track: {
          background: "#fff", // white track background
          strokeWidth: "67%",
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.7,
          },
        },
        dataLabels: {
          name: {
            offsetY: 0,
            show: true,
            color: "#000",
            fontSize: "14px",
            fontWeight: "normal",
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + " Trillion";
            },
            color: "#000",
            fontSize: "26px",
            lineHeight: "26px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#F30A34"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Total Supply"],
  };

  const series = [100];

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={350}
      />
    </div>
  );
};

export default MyRadialBarChart;
