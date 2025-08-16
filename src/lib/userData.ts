// 用户数据管理系统

import { MedicalReport, UserData, UsersDatabase } from '@/types/user';

// 模拟数据库 - 在实际应用中这应该是真实的数据库
const STORAGE_KEY = 'virtualgp_users_db';
const CURRENT_USER_KEY = 'virtualgp_current_user';

// 初始化示例数据
const initializeSampleData = (): UsersDatabase => {
  const sampleData: UsersDatabase = {
    'demo@example.com': {
      email: 'demo@example.com',
      name: 'Demo User',
      medicalReports: [
        {
          id: '1',
          title: 'Annual Health Checkup',
          date: new Date('2024-01-15'),
          description: 'Regular annual health examination',
          textContent: 'Blood pressure: 120/80, Heart rate: 72 bpm, Weight: 70kg, Height: 175cm. All vital signs are normal. Recommended to continue current lifestyle with regular exercise.',
          type: 'text'
        },
        {
          id: '2',
          title: 'X-Ray Results',
          date: new Date('2024-02-20'),
          description: 'Chest X-ray examination',
          textContent: 'No abnormalities detected in chest X-ray. Lung fields are clear, heart size is normal.',
          type: 'mixed'
        },
        {
          id: '3',
          title: 'Lab Test Results',
          date: new Date('2024-03-10'),
          description: 'Blood work and urine analysis',
          textContent: 'Complete Blood Count (CBC): All values within normal range. Blood glucose: 95 mg/dL (normal). Cholesterol: 180 mg/dL (optimal). Kidney function tests: Normal.',
          type: 'text'
        }
      ],
      createdAt: new Date('2024-01-01'),
      lastLoginAt: new Date()
    },
    'john@example.com': {
      email: 'john@example.com',
      name: 'John Smith',
      medicalReports: [
        {
          id: '4',
          title: 'Vaccination Record',
          date: new Date('2024-01-05'),
          description: 'COVID-19 booster shot',
          textContent: 'Received Pfizer-BioNTech COVID-19 booster vaccination. No adverse reactions observed. Next booster recommended in 6 months.',
          type: 'text'
        }
      ],
      createdAt: new Date('2024-01-05'),
      lastLoginAt: new Date()
    }
  };
  
  // 保存到localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData, (key, value) => {
    // 处理Date对象的序列化
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
  
  return sampleData;
};

// 获取用户数据库
export const getUsersDatabase = (): UsersDatabase => {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initializeSampleData();
  }
  
  try {
    const parsed = JSON.parse(stored, (key, value) => {
      // 处理Date对象的反序列化
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
    return parsed;
  } catch (error) {
    console.error('Error parsing users database:', error);
    return initializeSampleData();
  }
};

// 保存用户数据库
export const saveUsersDatabase = (database: UsersDatabase): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(database, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
};

// 设置当前用户
export const setCurrentUser = (email: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CURRENT_USER_KEY, email);
  
  // 更新最后登录时间
  const database = getUsersDatabase();
  if (database[email]) {
    database[email].lastLoginAt = new Date();
    saveUsersDatabase(database);
  }
};

// 获取当前用户邮箱
export const getCurrentUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(CURRENT_USER_KEY);
};

// 获取当前用户数据
export const getUserData = (email?: string): UserData | null => {
  const userEmail = email || getCurrentUserEmail();
  if (!userEmail) return null;
  
  const database = getUsersDatabase();
  return database[userEmail] || null;
};

// 保存用户数据
export const saveUserData = (userData: UserData): void => {
  const database = getUsersDatabase();
  database[userData.email] = userData;
  saveUsersDatabase(database);
};

// 创建新用户
export const createUser = (email: string, name?: string): UserData => {
  const userData: UserData = {
    email,
    name,
    medicalReports: [],
    createdAt: new Date(),
    lastLoginAt: new Date()
  };
  
  saveUserData(userData);
  setCurrentUser(email);
  
  return userData;
};

// 验证用户登录
export const loginUser = (email: string, password: string): boolean => {
  // 在实际应用中，这里应该验证密码
  // 现在简单地检查邮箱格式并创建/登录用户
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  
  const database = getUsersDatabase();
  
  // 如果用户不存在，创建新用户
  if (!database[email]) {
    createUser(email);
  } else {
    setCurrentUser(email);
  }
  
  return true;
};

// 登出用户
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CURRENT_USER_KEY);
};

// 获取所有用户（管理员功能）
export const getAllUsers = (): UserData[] => {
  const database = getUsersDatabase();
  return Object.values(database);
};
