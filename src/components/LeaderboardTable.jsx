import React, { useState } from 'react';
import { Medal, Edit2, Trash2, Clock } from 'lucide-react';

const TableRow = ({ teacher, index, onEdit, onDelete, onViewHistory, getMedalColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const projects = Object.entries(teacher.projects || {});
  const displayProjects = isExpanded ? projects : projects.slice(0, 3);

  return (
    <tr 
      style={{ 
        borderBottom: '1px solid var(--border-color)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.03)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '10px',
            background: index < 3 ? `${getMedalColor(index)}15` : 'var(--bg-app)',
            color: index < 3 ? getMedalColor(index) : 'var(--text-secondary)',
            fontWeight: '800',
            fontSize: '0.9rem'
          }}>
            {index + 1}
          </span>
          {index < 3 && <Medal size={18} color={getMedalColor(index)} fill={getMedalColor(index)} fillOpacity={0.2} />}
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>{teacher.name}</span>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '450px' }}>
          {displayProjects.map(([p, h]) => (
             <span key={p} style={{ 
               display: 'inline-flex', 
               alignItems: 'center',
               backgroundColor: 'rgba(59, 130, 246, 0.06)', 
               color: 'var(--primary)',
               padding: '3px 8px', 
               borderRadius: '6px', 
               fontSize: '0.75rem',
               fontWeight: '600',
               border: '1px solid rgba(59, 130, 246, 0.1)',
               whiteSpace: 'nowrap'
             }}>
               {p}: {h}h
             </span>
          ))}
          {projects.length > 3 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ 
                border: 'none',
                fontSize: '0.72rem', 
                color: 'var(--primary)', 
                background: 'var(--primary-light)', 
                padding: '3px 10px', 
                borderRadius: '6px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--primary-light)';
                e.target.style.color = 'var(--primary)';
              }}
            >
              {isExpanded ? '收起' : `+ ${projects.length - 3} 更多`}
            </button>
          )}
          {projects.length === 0 && <span style={{ color: 'var(--text-muted)' }}>-</span>}
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'baseline', 
          gap: '2px',
          padding: '4px 12px',
          background: 'var(--primary-light)',
          borderRadius: '100px',
          color: 'var(--primary)',
          fontWeight: '800',
          fontSize: '1.2rem'
        }}>
          {teacher.totalHours}<span style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.7 }}>h</span>
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button 
            className="btn-icon" 
            onClick={() => onViewHistory(teacher)} 
            title="查看明细" 
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            <Clock size={16} />
          </button>
          <button className="btn-icon" onClick={() => onEdit(teacher)} title="编辑" style={{ background: 'var(--bg-app)', color: 'var(--text-secondary)' }}>
            <Edit2 size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(teacher.id)} title="删除" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function LeaderboardTable({ data, onEdit, onDelete, onViewHistory }) {
  const getMedalColor = (index) => {
    switch(index) {
      case 0: return '#fbbf24'; // Gold
      case 1: return '#94a3b8'; // Silver
      case 2: return '#d97706'; // Bronze
      default: return 'transparent';
    }
  };

  return (
    <div className="card animate-fade-in" style={{ overflow: 'hidden', border: 'none', background: 'rgba(255, 255, 255, 0.4)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>排名</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>姓名</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>参与项目详情</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>总志愿时长</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--bg-app)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={24} />
                    </div>
                    <span style={{ fontWeight: '500' }}>暂无匹配数据</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((teacher, index) => (
                <TableRow 
                  key={teacher.id} 
                  teacher={teacher} 
                  index={index} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                  onViewHistory={onViewHistory}
                  getMedalColor={getMedalColor}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
