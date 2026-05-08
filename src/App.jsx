import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LeaderboardTable from './components/LeaderboardTable';
import VolunteerChart from './components/VolunteerChart';
import TeacherFormModal from './components/TeacherFormModal';
import HistoryModal from './components/HistoryModal';
import { getTeachersData, saveTeachersData, getAllProjectNames, calculateTotal } from './utils/storage';
import { Plus } from 'lucide-react';

function App() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedTeacherHistory, setSelectedTeacherHistory] = useState(null);

  useEffect(() => {
    setTeachers(getTeachersData());
  }, []);

  useEffect(() => {
    saveTeachersData(teachers);
  }, [teachers]);

  const projectNames = useMemo(() => getAllProjectNames(teachers), [teachers]);

  const processedData = useMemo(() => {
    const filtered = teachers.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.keys(t.projects || {}).some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return filtered.map(t => ({
      ...t,
      totalHours: calculateTotal(t.projects)
    })).sort((a, b) => b.totalHours - a.totalHours);
  }, [teachers, searchQuery]);

  const handleAddClick = () => {
    setEditingTeacher(null);
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const onViewHistory = (teacher) => {
    setSelectedTeacherHistory(teacher);
  };

  const onEditEntry = (entry, teacher) => {
    setEditingEntry({ ...entry, originalTeacherId: teacher.id });
    setEditingTeacher({ name: teacher.name }); // Pre-fill teacher name
    setIsModalOpen(true);
    setSelectedTeacherHistory(null); // Close history view
  };

  const onDeleteEntry = (entry, teacher) => {
    if (!window.confirm('确定要删除这笔记录吗？')) return;
    
    const updatedTeachers = teachers.map(t => {
      if (t.id === teacher.id) {
        const newHistory = (t.history || []).filter(e => e.timestamp !== entry.timestamp);
        const newProjects = {};
        newHistory.forEach(h => {
          newProjects[h.project] = Math.round(((newProjects[h.project] || 0) + h.hours) * 100) / 100;
        });
        return { ...t, history: newHistory, projects: newProjects };
      }
      return t;
    }).filter(t => Object.keys(t.projects).length > 0 || t.history?.length > 0);
    
    setTeachers(updatedTeachers);
    if (selectedTeacherHistory?.id === teacher.id) {
      setSelectedTeacherHistory(updatedTeachers.find(t => t.id === teacher.id) || null);
    }
  };

  const handleModalSubmit = (formData) => {
    const { name, projectName, hours, date } = formData;
    const trimmedName = name.trim();
    
    let newTeachers = [...teachers];

    // Case 1: Editing a specific entry (may involve moving to a different teacher)
    if (editingEntry) {
      const originalTeacherIndex = newTeachers.findIndex(t => t.id === editingEntry.originalTeacherId);
      if (originalTeacherIndex > -1) {
        const originalTeacher = { ...newTeachers[originalTeacherIndex] };
        originalTeacher.history = (originalTeacher.history || []).filter(e => e.timestamp !== editingEntry.timestamp);
        
        // Recalculate original teacher's project summary
        const newProjects = {};
        originalTeacher.history.forEach(h => {
          newProjects[h.project] = (newProjects[h.project] || 0) + h.hours;
        });
        originalTeacher.projects = newProjects;
        newTeachers[originalTeacherIndex] = originalTeacher;
      }
    }

    // Now insert the record (either new or edited) to the target teacher
    const targetIndex = newTeachers.findIndex(t => t.name.trim() === trimmedName);
    
    if (targetIndex > -1) {
      const teacher = { ...newTeachers[targetIndex] };
      const historyEntry = {
        date,
        project: projectName,
        hours,
        timestamp: editingEntry ? editingEntry.timestamp : new Date().getTime()
      };
      teacher.history = [...(teacher.history || []), historyEntry];
      
      // Recalculate project totals with precision protection
      const newProjects = {};
      teacher.history.forEach(h => {
        newProjects[h.project] = Math.round(((newProjects[h.project] || 0) + h.hours) * 100) / 100;
      });
      teacher.projects = newProjects;
      newTeachers[targetIndex] = teacher;
    } else {
      const newTeacher = {
        id: Date.now().toString(),
        name: trimmedName,
        projects: { [projectName]: hours },
        history: [{
          date,
          project: projectName,
          hours,
          timestamp: editingEntry ? editingEntry.timestamp : new Date().getTime()
        }]
      };
      newTeachers.push(newTeacher);
    }

    // Clean up empty teachers (if their last entry was moved or deleted)
    newTeachers = newTeachers.filter(t => Object.keys(t.projects).length > 0 || t.history?.length > 0);
    
    setTeachers(newTeachers);
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('确定要删除该教师的所有记录吗？')) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  return (
    <div className="app-wrapper">
      <div className="aspect-ratio-container">
        <div className="content-scrollable">
          <Header />
          
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button className="btn btn-primary" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
              <Plus size={20} /> 录入记录
            </button>
          </div>

          <div className="card" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.4)', marginBottom: '2.5rem' }}>
            <VolunteerChart data={processedData} projectNames={projectNames} />
          </div>

          <LeaderboardTable 
            data={processedData} 
            onEdit={handleEditTeacher} 
            onDelete={handleDeleteTeacher}
            onViewHistory={onViewHistory}
          />
          
          <footer style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2026 志愿者管理系统 · 记录每一份教育之光
          </footer>
        </div>
      </div>

      <TeacherFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingEntry(null); }} 
        onSubmit={handleModalSubmit}
        initialData={editingTeacher}
        projectNames={projectNames}
      />

      <HistoryModal 
        isOpen={!!selectedTeacherHistory}
        onClose={() => setSelectedTeacherHistory(null)}
        teacher={selectedTeacherHistory}
        onEditEntry={onEditEntry}
        onDeleteEntry={onDeleteEntry}
      />
    </div>
  );
}

export default App;
