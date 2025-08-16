// 用户和医疗报告的类型定义

export interface MedicalReport {
  id: string;
  title: string;
  date: Date;
  description?: string;
  imageUrl?: string;
  textContent?: string;
  type: 'text' | 'image' | 'mixed';
}

export interface UserData {
  email: string;
  name?: string;
  avatar?: string;
  medicalReports: MedicalReport[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UsersDatabase {
  [email: string]: UserData;
}
