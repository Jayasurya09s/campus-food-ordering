"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type ChartPoint = {
  date: string;
  amount: number;
};

type DashboardChartProps = {
  chartData: ChartPoint[];
};

export default function DashboardChart({
  chartData
}: DashboardChartProps) {
  return (
    <div className="h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#000"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
