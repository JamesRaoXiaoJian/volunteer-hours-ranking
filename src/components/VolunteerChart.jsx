import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Distinct modern colors
const COLORS = [
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#06b6d4'  // cyan
];

export default function VolunteerChart({ data, projectNames }) {
  if (!data || data.length === 0) return null;

  const chartData = useMemo(() => {
    return data.map(teacher => {
      const flattened = { name: teacher.name };
      projectNames.forEach(p => {
        flattened[p] = teacher.projects[p] || 0;
      });
      return flattened;
    });
  }, [data, projectNames]);

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <h3 style={{ marginBottom: '2.5rem', fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.25rem', textAlign: 'left' }}>
        志愿时长贡献分布 (项目累积)
      </h3>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(59, 130, 246, 0.04)', radius: 8 }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}
              itemStyle={{ fontWeight: 600, fontSize: '13px', padding: '2px 0' }}
              labelStyle={{ fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)', fontSize: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              layout="horizontal"
              wrapperStyle={{ 
                paddingBottom: '30px', 
                fontSize: '12px', 
                fontWeight: 600,
                maxWidth: '100%',
                overflow: 'hidden'
              }} 
            />
            {projectNames.map((project, index) => (
              <Bar 
                key={project}
                dataKey={project} 
                stackId="a" 
                fill={COLORS[index % COLORS.length]} 
                barSize={32}
                radius={index === projectNames.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
