import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock } from 'lucide-react';

export default function TeacherFormModal({ isOpen, onClose, onSubmit, initialData, projectNames, teachers, isEditingEntry }) {
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [calculatedHours, setCalculatedHours] = useState(2);
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const teacherOptions = useMemo(() => {
    return (teachers || [])
      .map((teacher) => teacher.name)
      .filter((name) => typeof name === 'string' && name.trim().length > 0);
  }, [teachers]);

  useEffect(() => {
    if (initialData) {
      setSelectedNames(initialData.name ? [initialData.name] : []);
      setSelectedProject(initialData.project || projectNames[0] || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
    } else {
      setSelectedNames([]);
      setSelectedProject(projectNames[0] || '');
      setDate(new Date().toISOString().split('T')[0]);
    }
    setShowNewProjectInput(false);
  }, [initialData, isOpen, projectNames]);

  // Calculate hours whenever start or end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      
      let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle overnight if needed
      
      const hours = Math.round((diffMinutes / 60) * 100) / 100; // Round to 2 decimals for precision
      setCalculatedHours(hours);
    }
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedNames.length || !selectedProject || calculatedHours <= 0) return;
    if (isEditingEntry && selectedNames.length !== 1) {
      window.alert('编辑记录时只能选择一个教师。');
      return;
    }

    // Send back data to App.jsx
    // Note: App.jsx handles merging into the teacher's projects object
    onSubmit({
      names: selectedNames,
      projectName: selectedProject,
      hours: calculatedHours,
      date: date
    });
    
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.3)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="card animate-modal teacher-modal" style={{ 
        width: '100%', 
        maxWidth: '540px', 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        borderRadius: 'var(--radius-xl)'
      }}>
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            录入服务时长
          </h2>
          <button type="button" className="btn-icon" onClick={onClose} style={{ background: 'var(--bg-app)' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Row 1: Teacher Selection & Date */}
          <div className="teacher-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>选择教师</label>
              {teacherOptions.length === 0 ? (
                <div style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  暂无教师数据
                </div>
              ) : (
                <div className="teacher-checkbox-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.75rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0.75rem',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {teacherOptions.map((teacherName) => {
                    const isChecked = selectedNames.includes(teacherName);
                    return (
                      <label key={teacherName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNames((prev) => Array.from(new Set([...prev, teacherName])));
                            } else {
                              setSelectedNames((prev) => prev.filter((name) => name !== teacherName));
                            }
                          }}
                        />
                        {teacherName}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>日期</label>
              <input 
                required
                type="date" 
                className="input" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Project Selection (Standard Select with Toggle for New) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>项目名称</label>
            {!showNewProjectInput ? (
              <select 
                required
                className="input"
                value={selectedProject}
                onChange={(e) => {
                  if (e.target.value === 'NEW_PROJECT') {
                    setShowNewProjectInput(true);
                    setSelectedProject('');
                  } else {
                    setSelectedProject(e.target.value);
                  }
                }}
                style={{ 
                  appearance: 'none', 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                  paddingRight: '2.5rem',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>请选择所属项目</option>
                {projectNames.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="NEW_PROJECT" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>+ 新增项目...</option>
              </select>
            ) : (
              <div style={{ position: 'relative' }}>
                <input 
                  autoFocus
                  type="text"
                  className="input"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  placeholder="输入新项目名称"
                  style={{ paddingRight: '4rem' }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    setShowNewProjectInput(false);
                    setSelectedProject(projectNames[0] || '');
                  }}
                  style={{ 
                    position: 'absolute', 
                    right: '0.5rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    border: 'none',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  返回选择
                </button>
              </div>
            )}
          </div>

          {/* Row 3: Time Period */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>时间段</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="time" 
                  className="input" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <span style={{ color: 'var(--text-muted)' }}>至</span>
              <div style={{ flex: 1 }}>
                <input 
                  type="time" 
                  className="input" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            {/* Hour feedback */}
            <div style={{ 
              marginTop: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <Clock size={16} />
              <span>合计时长: {calculatedHours} 小时</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              确认录入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
