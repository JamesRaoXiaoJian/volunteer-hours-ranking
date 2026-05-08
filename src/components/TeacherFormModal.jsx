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

  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
      if (diffMinutes < 0) diffMinutes += 24 * 60;
      setCalculatedHours(Math.round((diffMinutes / 60) * 100) / 100);
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

    onSubmit({
      names: selectedNames,
      projectName: selectedProject,
      hours: calculatedHours,
      date: date
    });

    onClose();
  };

  return (
    <div className="modal-overlay modal-backdrop">
      <div className="card animate-modal modal-card teacher-modal" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            录入服务时长
          </h2>
          <button type="button" className="btn-icon" onClick={onClose} style={{ background: 'var(--bg-app)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="teacher-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>选择教师</label>
              {teacherOptions.length === 0 ? (
                <div style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-app)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  暂无教师数据
                </div>
              ) : (
                <div className="teacher-checkbox-grid">
                  {teacherOptions.map((teacherName) => {
                    const isChecked = selectedNames.includes(teacherName);
                    return (
                      <label key={teacherName} className="teacher-checkbox-label">
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>项目名称</label>
            {!showNewProjectInput ? (
              <select
                required
                className="input select-arrow"
                value={selectedProject}
                onChange={(e) => {
                  if (e.target.value === 'NEW_PROJECT') {
                    setShowNewProjectInput(true);
                    setSelectedProject('');
                  } else {
                    setSelectedProject(e.target.value);
                  }
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
                  className="new-project-back"
                  onClick={() => {
                    setShowNewProjectInput(false);
                    setSelectedProject(projectNames[0] || '');
                  }}
                >
                  返回选择
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>时间段</label>
            <div className="time-row">
              <div style={{ flex: 1 }}>
                <input
                  type="time"
                  className="input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <span className="time-separator">至</span>
              <div style={{ flex: 1 }}>
                <input
                  type="time"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="hour-feedback">
              <Clock size={16} />
              <span>合计时长: {calculatedHours} 小时</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline btn-outline-col" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary btn-primary-col">
              确认录入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
