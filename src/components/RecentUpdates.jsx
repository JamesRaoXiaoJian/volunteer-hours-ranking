import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { getChangelog } from '../utils/storage';

const ACTION_CONFIG = {
  add: { icon: Plus, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', label: '新增' },
  edit: { icon: Edit2, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', label: '编辑' },
  delete: { icon: Trash2, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', label: '删除' },
  add_teacher: { icon: UserPlus, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', label: '新增教师' },
};

export default function RecentUpdates() {
  const [entries, setEntries] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getChangelog().then(setEntries);
  }, []);

  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  const display = isExpanded ? sorted : sorted.slice(0, 10);

  const formatTime = (ts) => {
    const d = new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <div className="card animate-fade-in" style={{
      marginTop: '2.5rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.4)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '10px',
          background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary)'
        }}>
          <Clock size={18} />
        </div>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '800',
          color: 'var(--text-primary)'
        }}>
          最近更新记录
        </h3>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-app)',
          padding: '2px 10px',
          borderRadius: '100px'
        }}>
          {sorted.length} 条
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {display.map((entry, idx) => {
          const cfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.add;
          const Icon = cfg.icon;
          return (
            <div key={entry.id || idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '8px',
                background: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: cfg.color,
                flexShrink: 0
              }}>
                <Icon size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {entry.description}
                </div>
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                {formatTime(entry.timestamp)}
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length > 10 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '0.6rem',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--primary)',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--primary-light)';
            e.target.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'var(--border-color)';
          }}
        >
          {isExpanded ? '收起' : `查看全部 ${sorted.length} 条记录`}
        </button>
      )}
    </div>
  );
}
