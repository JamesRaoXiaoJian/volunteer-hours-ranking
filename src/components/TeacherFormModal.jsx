import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, Plus, XCircle } from 'lucide-react';

export default function TeacherFormModal({
  isOpen, onClose, onSubmit, initialData, projectNames, teachers, isEditingEntry,
  onAddTeacher, onDeleteTeacher, onAddProject, onDeleteProject
}) {
  const [selectedNames, setSelectedNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [calculatedHours, setCalculatedHours] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

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
    onSubmit({ names: selectedNames, projectName: selectedProject, hours: calculatedHours, date });
    onClose();
  };

  const handleAddTeacherInternal = () => {
    const name = newTeacherName.trim();
    if (!name) return;
    if (teacherOptions.includes(name)) { setNewTeacherName(''); return; }
    onAddTeacher(name);
    setNewTeacherName('');
  };

  const handleAddProjectInternal = () => {
    const name = newProjectName.trim();
    if (!name) return;
    if (projectNames.includes(name)) { setNewProjectName(''); return; }
    onAddProject(name);
    setSelectedProject(name);
    setNewProjectName('');
  };

  return (
    <div className="modal-overlay modal-backdrop">
      <div className="card animate-modal modal-card teacher-modal" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            录入服务时长
          </h2>
          <button type="button" className="btn-icon" onClick={onClose} style={{ background: 'var(--bg-app)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* 教师选择 + 日期 */}
          <div className="teacher-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label">选择教师</label>
              <div className="selection-grid">
                {teacherOptions.map((name) => (
                  <div key={name} className="selection-grid-item">
                    <label className="selection-grid-label">
                      <input
                        type="checkbox"
                        checked={selectedNames.includes(name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNames((prev) => [...new Set([...prev, name])]);
                          } else {
                            setSelectedNames((prev) => prev.filter((n) => n !== name));
                          }
                        }}
                      />
                      <span>{name}</span>
                    </label>
                    <button type="button" className="grid-item-delete" onClick={() => onDeleteTeacher(name)} title="删除教师">
                      <XCircle size={13} />
                    </button>
                  </div>
                ))}
                <div className="grid-add-item">
                  <input
                    type="text"
                    className="grid-add-input"
                    placeholder="新教师"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTeacherInternal(); } }}
                  />
                  <button type="button" className="grid-add-btn" onClick={handleAddTeacherInternal}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">日期</label>
              <input required type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          {/* 项目选择 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">项目选择</label>
            <div className="selection-grid">
              {projectNames.map((name) => (
                <div key={name} className="selection-grid-item">
                  <label className="selection-grid-label">
                    <input
                      type="radio"
                      name="project"
                      checked={selectedProject === name}
                      onChange={() => setSelectedProject(name)}
                    />
                    <span>{name}</span>
                  </label>
                  <button type="button" className="grid-item-delete" onClick={() => onDeleteProject(name)} title="删除项目">
                    <XCircle size={13} />
                  </button>
                </div>
              ))}
              <div className="grid-add-item">
                <input
                  type="text"
                  className="grid-add-input"
                  placeholder="新项目"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddProjectInternal(); } }}
                />
                <button type="button" className="grid-add-btn" onClick={handleAddProjectInternal}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* 时间段 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">时间段</label>
            <div className="time-row">
              <div style={{ flex: 1 }}>
                <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <span className="time-separator">至</span>
              <div style={{ flex: 1 }}>
                <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div className="hour-feedback">
              <Clock size={16} />
              <span>合计时长: {calculatedHours} 小时</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
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
