"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RsvpStats } from "@/types/admin";

interface AdminAttendanceChartProps {
  stats: RsvpStats;
}

const COLORS = ["#10b981", "#f43f5e", "#f59e0b"];

export function AdminAttendanceChart({ stats }: AdminAttendanceChartProps) {
  const data = [
    { name: "Attending", value: stats.attending },
    { name: "Declining", value: stats.declining },
    { name: "Pending", value: stats.pending },
  ].filter((item) => item.value > 0);

  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm">
      <h3 className="font-serif text-xl font-medium text-text">
        Response breakdown
      </h3>
      <p className="mt-1 text-sm text-text/60">
        {stats.totalResponded} of {stats.totalInvited} guests have responded
      </p>

      {data.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text/50">
          No responses yet.
        </p>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
