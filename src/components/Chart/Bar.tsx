"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { useTheme } from "@/context/ThemeProvider";

interface ChartProps {
  data?: any;
  xData?: any;
  height?: number;
  style?: React.CSSProperties;
  showLegend?: boolean;
  showTooltips?: boolean;
}

export const Bar: FC<ChartProps> = ({
  data = [],
  xData = [],
  height = 450,
  style,
  showLegend = true,
  showTooltips = true,
}) => {
  const { theme } = useTheme();
  const [options, setOptions] = useState<EChartsOption>({});
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (document.visibilityState === "hidden") return;

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
      },
      legend: {
        show: showLegend,
        bottom: 0,
        textStyle: {
          color: theme === "light" ? "#1e293b" : "#f1f5f9",
        },
      },
      grid: {
        left: "3%",
        right: "3%",
        top: "10%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: xData,
        axisPointer: {
          type: "shadow",
        },
        axisLabel: {
          interval: 0,
          fontSize: 12,
          color: theme === "light" ? "#1e293b" : "#f1f5f9",
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          fontSize: 12,
          color: theme === "light" ? "#1e293b" : "#f1f5f9",
        },
      },
      series: [
        {
          name: "Bar",
          type: "bar",
          data: data,
        },
        {
          name: "Line",
          type: "line",
          data: data,
        },
      ],
    });
  }, [theme, data, xData, showLegend, showTooltips]);

  return (
    <ReactECharts
      ref={chartRef}
      option={options}
      style={{ height, ...style, zIndex: 1, marginBottom: 25 }}
    />
  );
};
