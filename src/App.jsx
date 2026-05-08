import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LeaderboardTable from './components/LeaderboardTable';
import VolunteerChart from './components/VolunteerChart';
import TeacherFormModal from './components/TeacherFormModal';
import HistoryModal from './components/HistoryModal';
import RecentUpdates from './components/RecentUpdates';
import { getTeachersData, saveTeachersData, getAllProjectNames, calculateTotal, addChangelogEntry, recalculateProjects, getProjects, saveProjects } from './utils/storage';
import { Plus } from 'lucide-react';

function useDebouncedSave(fn, ms = 500) {
  const timer = useRef(null);
  return useCallback((data) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(data), ms);
  }, [fn, ms]);
}

function App() {
  const [teachers, setTeachers] = useState([]);
  const [serverProjects, setServerProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [selectedTeacherHistory, setSelectedTeacherHistory] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [changelogKey, setChangelogKey] = useState(0);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const [data, projects] = await Promise.all([getTeachersData(), getProjects()]);
      if (isActive) {
        setTeachers(data);
        setServerProjects(projects);
        setIsLoaded(true);
      }
    };

    load();
    return () => { isActive = false; };
  }, []);

  const debouncedSave = useMemo(() => useDebouncedSave(saveTeachersData), []);

  useEffect(() => {
    if (!isLoaded) return;
    debouncedSave(teachers);
  }, [teachers, isLoaded, debouncedSave]);

  const projectNames = useMemo(() => getAllProjectNames(teachers, serverProjects), [teachers, serverProjects]);

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
    setEditingTeacher({ name: teacher.name });
    setIsModalOpen(true);
    setSelectedTeacherHistory(null);
  };

  const onDeleteEntry = (entry, teacher) => {
    if (!window.confirm('确定要删除这笔记录吗？')) return;

    const updatedTeachers = teachers.map(t => {
      if (t.id === teacher.id) {
        const newHistory = (t.history || []).filter(e => e.timestamp !== entry.timestamp);
        return { ...t, history: newHistory, projects: recalculateProjects(newHistory) };
      }
      return t;
    });

    setTeachers(updatedTeachers);
    if (selectedTeacherHistory?.id === teacher.id) {
      setSelectedTeacherHistory(updatedTeachers.find(t => t.id === teacher.id) || null);
    }
    addChangelogEntry({ action: 'delete', description: `删除了 ${teacher.name} 的「${entry.project}」${entry.hours}小时记录` });
    setChangelogKey(k => k + 1);
  };

  const handleModalSubmit = (formData) => {
    const { names, projectName, hours, date } = formData;
    const selectedNames = (Array.isArray(names) ? names : [])
      .map((entryName) => entryName.trim())
      .filter((entryName) => entryName.length > 0);

    if (selectedNames.length === 0) return;

    let newTeachers = [...teachers];

    if (editingEntry) {
      const originalTeacherIndex = newTeachers.findIndex(t => t.id === editingEntry.originalTeacherId);
      if (originalTeacherIndex > -1) {
        const originalTeacher = { ...newTeachers[originalTeacherIndex] };
        originalTeacher.history = (originalTeacher.history || []).filter(e => e.timestamp !== editingEntry.timestamp);
        originalTeacher.projects = recalculateProjects(originalTeacher.history);
        newTeachers[originalTeacherIndex] = originalTeacher;
      }
    }

    const timestampBase = editingEntry ? editingEntry.timestamp : new Date().getTime();
    selectedNames.forEach((selectedName, idx) => {
      const targetIndex = newTeachers.findIndex(t => t.name.trim() === selectedName);

      if (targetIndex > -1) {
        const teacher = { ...newTeachers[targetIndex] };
        const historyEntry = {
          date,
          project: projectName,
          hours,
          timestamp: editingEntry ? timestampBase : timestampBase + idx
        };
        teacher.history = [...(teacher.history || []), historyEntry];
        teacher.projects = recalculateProjects(teacher.history);
        newTeachers[targetIndex] = teacher;
      } else {
        const newTeacher = {
          id: (Date.now() + idx).toString(),
          name: selectedName,
          projects: { [projectName]: hours },
          history: [{
            date,
            project: projectName,
            hours,
            timestamp: editingEntry ? timestampBase : timestampBase + idx
          }]
        };
        newTeachers.push(newTeacher);
      }
    });

    setTeachers(newTeachers);
    setIsModalOpen(false);
    setEditingEntry(null);

    const namesStr = selectedNames.join('、');
    if (editingEntry) {
      addChangelogEntry({ action: 'edit', description: `编辑了 ${namesStr} 的「${projectName}」${hours}小时` });
    } else {
      const isNewTeacher = selectedNames.some(n => !teachers.some(t => t.name.trim() === n));
      if (isNewTeacher) {
        addChangelogEntry({ action: 'add_teacher', description: `新增教师 ${namesStr}，录入「${projectName}」${hours}小时` });
      } else {
        addChangelogEntry({ action: 'add', description: `为 ${namesStr} 录入「${projectName}」${hours}小时` });
      }
    }
    setChangelogKey(k => k + 1);
  };

  const handleDeleteTeacher = (id) => {
    if (window.confirm('确定要删除该教师的所有记录吗？')) {
      const teacher = teachers.find(t => t.id === id);
      setTeachers(teachers.filter(t => t.id !== id));
      if (teacher) {
        addChangelogEntry({ action: 'delete', description: `删除了教师 ${teacher.name} 的所有记录` });
        setChangelogKey(k => k + 1);
      }
    }
  };

  const handleAddTeacherName = (name) => {
    if (teachers.some(t => t.name.trim() === name.trim())) return;
    const newTeacher = { id: Date.now().toString(), name: name.trim(), projects: {}, history: [] };
    setTeachers(prev => [...prev, newTeacher]);
    addChangelogEntry({ action: 'add_teacher', description: `新增教师 ${name.trim()}` });
    setChangelogKey(k => k + 1);
  };

  const handleDeleteTeacherName = (name) => {
    if (!window.confirm(`确定要删除教师「${name}」吗？`)) return;
    setTeachers(prev => prev.filter(t => t.name.trim() !== name.trim()));
    addChangelogEntry({ action: 'delete', description: `删除了教师 ${name}` });
    setChangelogKey(k => k + 1);
  };

  const handleAddProject = (name) => {
    const trimmed = name.trim();
    if (!trimmed || serverProjects.includes(trimmed)) return;
    const updated = [...serverProjects, trimmed];
    setServerProjects(updated);
    saveProjects(updated);
    addChangelogEntry({ action: 'add', description: `新增项目「${trimmed}」` });
    setChangelogKey(k => k + 1);
  };

  const handleDeleteProject = (name) => {
    if (!window.confirm(`确定要删除项目「${name}」吗？将清除所有教师中该项目的数据。`)) return;
    const updatedProjects = serverProjects.filter(p => p !== name);
    setServerProjects(updatedProjects);
    saveProjects(updatedProjects);

    const updatedTeachers = teachers.map(t => {
      const newHistory = (t.history || []).filter(h => h.project !== name);
      const newProjects = recalculateProjects(newHistory);
      return { ...t, history: newHistory, projects: newProjects };
    });

    setTeachers(updatedTeachers);
    addChangelogEntry({ action: 'delete', description: `删除了项目「${name}」` });
    setChangelogKey(k => k + 1);
  };

  return (
    <div className="app-wrapper">
      <div className="aspect-ratio-container">
        <div className="content-scrollable">
          <Header />

          <div className="toolbar">
            <div style={{ flex: 1 }}>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <button className="btn btn-primary add-btn" onClick={handleAddClick}>
              <Plus size={20} /> 录入记录
            </button>
          </div>

          <div className="card chart-card">
            <VolunteerChart data={processedData} projectNames={projectNames} />
          </div>

          <LeaderboardTable
            data={processedData}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            onViewHistory={onViewHistory}
          />

          <RecentUpdates key={changelogKey} />

          <footer className="app-footer">
            © 2026 教师服务管理系统 · 记录每一份教育之光
          </footer>
        </div>
      </div>

      <TeacherFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEntry(null); }}
        onSubmit={handleModalSubmit}
        initialData={editingTeacher}
        projectNames={projectNames}
        teachers={teachers}
        isEditingEntry={!!editingEntry}
        onAddTeacher={handleAddTeacherName}
        onDeleteTeacher={handleDeleteTeacherName}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
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
