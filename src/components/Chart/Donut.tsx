"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useTheme } from "@/context/ThemeProvider";

interface ChartProps {
  data?: { name: string; value: number }[];
  height?: number;
  style?: React.CSSProperties;
  showLegend?: boolean;
  showTooltips?: boolean;
}

export const Donut: FC<ChartProps> = ({
  data = [],
  height = 300,
  style,
  showLegend = true,
  showTooltips = true,
}) => {
  const { theme } = useTheme();
  const [options, setOptions] = useState<EChartsOption>({});
  const chartRef = useRef<any>(null);

  useEffect(() => {
    setOptions({
      color: [
        "#4f46e5",
        "#d1d5db",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ],
      tooltip: {
        show: showTooltips,
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        show: showLegend,
        bottom: "0",
        left: "center",
        textStyle: {
          color: theme === "light" ? "#1e293b" : "#f1f5f9",
        },
      },
      grid: {
        left: "3%",
        right: "3%",
        top: "10%",
        bottom: "20%",
        containLabel: true,
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 1,
          },
          label: {
            show: false,
            position: "center",
            color: theme === "light" ? "#1e293b" : "#f1f5f9",
            fontSize: 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              color: theme === "light" ? "#1e293b" : "#f1f5f9",
            },
          },
          labelLine: {
            show: false,
          },
          data,
        },
      ],
    });
  }, [theme, data, showLegend, showTooltips]);

  return (
    <ReactECharts
      ref={chartRef}
      option={options}
      style={{ height, ...style, zIndex: 1 }}
    />
  );
};
