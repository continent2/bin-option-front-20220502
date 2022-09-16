import { useEffect } from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function ClosedChart({ price, data }) {
  const [chartList, setChartList] = useState([]);

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      zoom: {
        autoScaleYaxis: true,
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#fff"],
    stroke: {
      width: 1,
    },
    annotations: {
      yaxis: [
        {
          y: price,
          borderColor: "#00E396",
          label: {
            show: true,
            text: `$${price}`,
            borderRadius: 10,
            offsetY: 0,
            borderWidth: 0,
            style: {
              borderColor: "#000",
              borderWidth: 0,
              color: "#fff",
              background: "#3fb68b66",
              fontSize: 10,
              cssClass: "apexcharts-yaxis-annotation-label",
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4,
              },
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      show: false,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
    },
    fill: {
      colors: ["#fff", "#000"],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [-20, 100],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  useEffect(() => {
    if (!data) return;
    let _chartList = [];

    data.map((e, i) => {
      _chartList.push([
        new Date(new Date().setSeconds(0)).getTime() + i * 60000,
        e,
      ]);
    });

    setChartList(_chartList);
  }, [data]);

  return (
    <ReactApexChart
      options={options}
      series={[
        {
          data: chartList,
        },
      ]}
      type="area"
      height={"100%"}
    />
  );
}
