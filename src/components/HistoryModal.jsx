import React from 'react';
import { X, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, teacher, onEditEntry, onDeleteEntry }) {
  if (!isOpen || !teacher) return null;

  const history = [...(teacher.history || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="modal-overlay modal-backdrop-strong" style={{ zIndex: 1100 }}>
      <div className="card animate-modal history-modal" style={{
        maxWidth: '700px',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}>
        <div className="modal-header" style={{ background: 'var(--bg-app)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              服务明细记录
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              教师：<span style={{ fontWeight: '700', color: 'var(--primary)' }}>{teacher.name}</span>
            </p>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} style={{ background: 'white' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              暂无明细记录
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {history.map((entry, idx) => (
                <div key={entry.timestamp || idx} className="history-entry hover-row">
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div className="history-entry-icon">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {entry.project}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} /> {entry.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> {entry.hours} 小时
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="action-group">
                    <button
                      className="btn-icon"
                      onClick={() => onEditEntry(entry, teacher)}
                      style={{ background: 'var(--bg-app)', color: 'var(--primary)' }}
                      title="编辑此项"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onDeleteEntry(entry, teacher)}
                      style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)' }}
                      title="删除此项"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
