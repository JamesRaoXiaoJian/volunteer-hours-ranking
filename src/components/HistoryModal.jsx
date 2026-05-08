import React from 'react';
import { X, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, teacher, onEditEntry, onDeleteEntry }) {
  if (!isOpen || !teacher) return null;

  const history = [...(teacher.history || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1100,
      padding: '1.5rem'
    }}>
      <div className="card animate-modal history-modal" style={{ 
        width: '100%', 
        maxWidth: '700px', 
        backgroundColor: 'rgba(255, 255, 255, 0.98)', 
        maxHeight: '85vh', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg-app)'
        }}>
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
                <div key={entry.timestamp || idx} style={{ 
                  padding: '1.25rem', 
                  background: 'white', 
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ 
                      width: '48px', height: '48px', 
                      background: 'var(--primary-light)', 
                      borderRadius: '12px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
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
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        
        <div style={{ padding: '1.5rem 2rem', background: 'var(--bg-app)', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            完成
          </button>
        </div>
      </div>
    </div>
  );
}
