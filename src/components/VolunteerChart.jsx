import React, { useRef, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">{label}</p>
        <ul className="chart-tooltip-list">
          {payload.map((entry, index) => {
            if (entry.value === 0) return null;
            const formattedValue = typeof entry.value === 'number' ? Number(entry.value.toFixed(2)) : entry.value;
            return (
              <li key={index} style={{ color: entry.color }}>
                {entry.name} : {formattedValue}
              </li>
            );
          })}
        </ul>
        <div className="chart-tooltip-total">
          总计 : {Number(payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(2))}
        </div>
      </div>
    );
  }
  return null;
};

export default function VolunteerChart({ data, projectNames }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setReady(true));
  }, []);

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  return (
    <div ref={containerRef} className="chart-container">
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.04)', radius: 8 }}
              content={<CustomTooltip />}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              iconSize={8}
            />
            {projectNames.map((project, index) => (
              <Bar
                key={project}
                dataKey={`projects.${project}`}
                name={project}
                stackId="a"
                fill={colors[index % colors.length]}
                barSize={40}
                radius={[index === projectNames.length - 1 ? 4 : 0, index === projectNames.length - 1 ? 4 : 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
