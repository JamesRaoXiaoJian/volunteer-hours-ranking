import React from 'react';
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
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
        padding: '16px', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: '800', color: '#1e293b', fontSize: '1.05rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '6px' }}>{label}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {payload.map((entry, index) => {
            if (entry.value === 0) return null;
            const formattedValue = typeof entry.value === 'number' ? Number(entry.value.toFixed(2)) : entry.value;
            return (
              <li key={index} style={{ color: entry.color, fontSize: '0.85rem', fontWeight: '600' }}>
                {entry.name} : {formattedValue}
              </li>
            );
          })}
        </ul>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee', fontWeight: '800', color: '#1e293b' }}>
          总计 : {Number(payload.reduce((sum, entry) => sum + (entry.value || 0), 0).toFixed(2))}
        </div>
      </div>
    );
  }
  return null;
};

export default function VolunteerChart({ data, projectNames }) {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  return (
    <div style={{ width: '100%', height: 400, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
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
              barSize={45}
              radius={[index === projectNames.length - 1 ? 4 : 0, index === projectNames.length - 1 ? 4 : 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
