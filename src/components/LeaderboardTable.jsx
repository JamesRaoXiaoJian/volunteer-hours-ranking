import React, { useState } from 'react';
import { Medal, Edit2, Trash2, Clock } from 'lucide-react';

const RANK_CLASSES = ['gold', 'silver', 'bronze'];

const TableRow = ({ teacher, index, onEdit, onDelete, onViewHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const projects = Object.entries(teacher.projects || {});
  const displayProjects = isExpanded ? projects : projects.slice(0, 3);
  const rankClass = index < 3 ? RANK_CLASSES[index] : 'default';

  return (
    <tr>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`rank-badge ${rankClass}`}>{index + 1}</span>
          {index < 3 && <Medal size={18} color={index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#d97706'} fill={index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : '#d97706'} fillOpacity={0.2} />}
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>{teacher.name}</span>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxWidth: '450px' }}>
          {displayProjects.map(([p, h]) => (
            <span key={p} className="project-tag">{p}: {h}h</span>
          ))}
          {projects.length > 3 && (
            <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? '收起' : `+ ${projects.length - 3} 更多`}
            </button>
          )}
          {projects.length === 0 && <span style={{ color: 'var(--text-muted)' }}>-</span>}
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem' }}>
        <div className="total-pill">
          {teacher.totalHours}<small>h</small>
        </div>
      </td>
      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
        <div className="action-group">
          <button className="btn-icon" onClick={() => onViewHistory(teacher)} title="查看明细" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
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
  return (
    <div className="card animate-fade-in" style={{ overflow: 'hidden', border: 'none', background: 'rgba(255, 255, 255, 0.4)' }}>
      <div className="table-scroll" style={{ overflowX: 'auto' }}>
        <table className="leaderboard-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>排名</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>姓名</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>参与项目详情</th>
              <th style={{ padding: '1.25rem 1.5rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>总服务时长</th>
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
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
