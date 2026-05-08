import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit2, Trash2, UserPlus } from 'lucide-react';
import { getChangelog } from '../utils/storage';

const ACTION_CONFIG = {
  add: { icon: Plus, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
  edit: { icon: Edit2, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)' },
  delete: { icon: Trash2, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
  add_teacher: { icon: UserPlus, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)' },
};

const formatTime = (ts) => {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function RecentUpdates() {
  const [entries, setEntries] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getChangelog().then(setEntries);
  }, []);

  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const display = isExpanded ? sorted : sorted.slice(0, 10);

  return (
    <div className="card animate-fade-in" style={{
      marginTop: '2.5rem',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.4)'
    }}>
      <div className="section-header">
        <div className="section-header-icon">
          <Clock size={18} />
        </div>
        <h3 className="section-header-title">最近更新记录</h3>
        <span className="section-header-count">{sorted.length} 条</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {display.map((entry, idx) => {
          const cfg = ACTION_CONFIG[entry.action] || ACTION_CONFIG.add;
          const Icon = cfg.icon;
          return (
            <div key={entry.id || idx} className="changelog-entry hover-row">
              <div className="changelog-icon" style={{ background: cfg.bg, color: cfg.color }}>
                <Icon size={14} />
              </div>
              <div className="changelog-description">{entry.description}</div>
              <div className="changelog-time">{formatTime(entry.timestamp)}</div>
            </div>
          );
        })}
      </div>

      {sorted.length > 10 && (
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '收起' : `查看全部 ${sorted.length} 条记录`}
        </button>
      )}
    </div>
  );
}
