import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      <ul className="chart-tooltip-list">
        {payload.map((entry, i) => {
          if (entry.value === 0) return null;
          return (
            <li key={i} style={{ color: entry.color }}>
              {entry.name} : {Number(entry.value.toFixed(2))}
            </li>
          );
        })}
      </ul>
      <div className="chart-tooltip-total">
        总计 : {Number(payload.reduce((s, e) => s + (e.value || 0), 0).toFixed(2))}
      </div>
    </div>
  );
};

const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="chart-legend">
      {payload.map((entry, index) => (
        <span key={entry.value} className="chart-legend-item">
          <span className="chart-legend-dot" style={{ background: entry.color }} />
          <span>{entry.value}</span>
        </span>
      ))}
    </div>
  );
};

export default React.memo(function VolunteerChart({ data, projectNames }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div ref={containerRef} className="chart-container">
      {ready && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} />
            <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.04)' }} content={<CustomTooltip />} />
            <Legend content={renderLegend} />
            {projectNames.map((project, index) => (
              <Bar
                key={project}
                dataKey={`projects.${project}`}
                name={project}
                stackId="a"
                fill={colors[index % colors.length]}
                barSize={36}
                radius={[index === projectNames.length - 1 ? 4 : 0, index === projectNames.length - 1 ? 4 : 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
});
