const API_BASE = import.meta.env.DEV
  ? 'http://localhost:3000'
  : (import.meta.env.VITE_API_BASE || 'https://ipclab.cloud');
const BACKUP_URL = `${import.meta.env.BASE_URL}teachers.backup.json`;

// Helper to calculate total hours dynamically
export const calculateTotal = (projects) => {
  const total = Object.values(projects || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  return Math.round(total * 100) / 100;
};

const normalizeTeachers = (data) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(teacher => {
    if ((!teacher.history || teacher.history.length === 0) && Object.keys(teacher.projects || {}).length > 0) {
      const history = Object.entries(teacher.projects).map(([project, hours]) => ({
        date: new Date().toISOString().split('T')[0],
        project,
        hours,
        timestamp: Date.now() + Math.random()
      }));
      return { ...teacher, history };
    }
    return teacher;
  });
};

export const getTeachersData = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/teachers`);
    if (!response.ok) {
      throw new Error(`Failed to load teachers: ${response.status}`);
    }
    const data = await response.json();
    return normalizeTeachers(data);
  } catch (error) {
    console.error('Failed to fetch teachers data from backend.', error);
    try {
      const backupResponse = await fetch(BACKUP_URL, { cache: 'no-cache' });
      if (!backupResponse.ok) {
        throw new Error(`Failed to load backup: ${backupResponse.status}`);
      }
      const backupData = await backupResponse.json();
      return normalizeTeachers(backupData);
    } catch (backupError) {
      console.error('Failed to fetch teachers backup data.', backupError);
      return [];
    }
  }
};

export const saveTeachersData = async (data) => {
  if (!Array.isArray(data)) {
    return;
  }

  try {
    await fetch(`${API_BASE}/api/teachers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error('Failed to save teachers data to backend.', error);
  }
};

export const getAllProjectNames = (data) => {
  const projectNames = new Set([
    '硕士复试', '调剂复试名单遴选', '硕士调剂复试', '培养方案和品牌专业讨论', 
    '学院十五五规划讨论', '人机协作观摩课', '中心建设会议', '本科转专业面试'
  ]);
  
  if (Array.isArray(data)) {
    data.forEach(teacher => {
      if (teacher.projects) {
        Object.keys(teacher.projects).forEach(p => projectNames.add(p));
      }
      if (teacher.history) {
        teacher.history.forEach(h => projectNames.add(h.project));
      }
    });
  }
  return Array.from(projectNames);
};
