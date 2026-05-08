import initialTeachersData from '../data/teachers.json';

const STORAGE_KEY = 'volunteer_leaderboard_data_v4';

// Helper to calculate total hours dynamically
export const calculateTotal = (projects) => {
  const total = Object.values(projects || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  return Math.round(total * 100) / 100;
};

export const getTeachersData = () => {
  const localData = localStorage.getItem(STORAGE_KEY);
  let finalData = initialTeachersData;

  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      // Only use local data if it's a non-empty array
      if (Array.isArray(parsed) && parsed.length > 0) {
        finalData = parsed;
      }
    } catch (e) {
      console.error("Failed to parse local storage data, falling back to JSON file.", e);
      finalData = initialTeachersData;
    }
  }

  // Final check: Ensure history and projects are synced
  return finalData.map(teacher => {
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

export const saveTeachersData = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
