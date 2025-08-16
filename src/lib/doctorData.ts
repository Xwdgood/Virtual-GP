// 医生数据库模拟

import { Doctor } from '@/types/doctor';

// Auckland地区医院地址列表
const aucklandHospitals = [
  "Auckland City Hospital, 2 Park Rd, Grafton, Auckland 1023",
  "North Shore Hospital, 124 Shakespeare Rd, Takapuna, Auckland 0622",
  "Middlemore Hospital, 100 Hospital Rd, Papatoetoe, Auckland 2025",
  "Waitakere Hospital, 55 Lincoln Rd, Henderson, Auckland 0610",
  "Starship Children's Hospital, 2 Park Rd, Grafton, Auckland 1023",
  "Greenlane Clinical Centre, 214 Green Lane West, Epsom, Auckland 1051",
  "Auckland Eye, 140 Remuera Rd, Remuera, Auckland 1050",
  "Mercy Hospital, 98 Mountain Rd, Epsom, Auckland 1023",
  "Ascot Hospital, 90 Greenlane East, Remuera, Auckland 1051",
  "Southern Cross Hospital, 90 Greenlane East, Remuera, Auckland 1051"
];

// 移除未使用的变量和函数

// 模拟医生数据库
export const doctorsDatabase: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Loe",
    avatar: "https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=400&h=400&fit=crop&crop=face",
    specialty: "General Practice",
    earliestAvailable: new Date("2025-08-16T18:00:00"),
    location: aucklandHospitals[0],
    distance: 2,
    cost: 20,
    rating: 4.8,
    experience: 12,
    description: "Experienced general practitioner with focus on preventive care and family medicine.",
    gender: 'female',
    availableTimeSlots: ['morning', 'afternoon']
  },
  {
    id: "2", 
    name: "Dr. John Doe",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specialty: "Internal Medicine",
    earliestAvailable: new Date("2025-08-18T12:00:00"),
    location: aucklandHospitals[1],
    distance: 0,
    cost: 0,
    rating: 4.9,
    experience: 15,
    description: "Specialist in internal medicine with expertise in chronic disease management.",
    gender: 'male',
    availableTimeSlots: ['allday']
  },
  {
    id: "3",
    name: "Dr. Joanna Poe",
    avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
    specialty: "Cardiology",
    earliestAvailable: new Date("2025-08-20T14:30:00"),
    location: aucklandHospitals[2],
    distance: 5,
    cost: 45,
    rating: 4.7,
    experience: 18,
    description: "Cardiologist specializing in heart disease prevention and treatment.",
    gender: 'female',
    availableTimeSlots: ['afternoon']
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    specialty: "Dermatology",
    earliestAvailable: new Date("2025-08-17T10:00:00"),
    location: aucklandHospitals[3],
    distance: 3,
    cost: 35,
    rating: 4.6,
    experience: 10,
    description: "Dermatologist with expertise in skin conditions and cosmetic procedures.",
    gender: 'male',
    availableTimeSlots: ['morning', 'afternoon']
  },
  {
    id: "5",
    name: "Dr. Sarah Wilson",
    avatar: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face",
    specialty: "Pediatrics",
    earliestAvailable: new Date("2025-08-19T09:30:00"),
    location: aucklandHospitals[4],
    distance: 4,
    cost: 25,
    rating: 4.9,
    experience: 14,
    description: "Pediatrician dedicated to providing comprehensive care for children and adolescents.",
    gender: 'female',
    availableTimeSlots: ['morning']
  },
  {
    id: "6",
    name: "Dr. Robert Taylor",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    specialty: "Orthopedics",
    earliestAvailable: new Date("2025-08-21T16:00:00"),
    location: aucklandHospitals[5],
    distance: 6,
    cost: 50,
    rating: 4.8,
    experience: 20,
    description: "Orthopedic surgeon specializing in joint replacement and sports medicine.",
    gender: 'male',
    availableTimeSlots: ['afternoon']
  },
  {
    id: "7",
    name: "Dr. Emily Brown",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop&crop=face",
    specialty: "Psychiatry",
    earliestAvailable: new Date("2025-08-22T11:00:00"),
    location: aucklandHospitals[6],
    distance: 7,
    cost: 40,
    rating: 4.7,
    experience: 16,
    description: "Psychiatrist focusing on mental health disorders and therapeutic interventions.",
    gender: 'female',
    availableTimeSlots: ['allday']
  },
  {
    id: "8",
    name: "Dr. David Kim",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    specialty: "Neurology",
    earliestAvailable: new Date("2025-08-23T15:30:00"),
    location: aucklandHospitals[7],
    distance: 8,
    cost: 55,
    rating: 4.9,
    experience: 22,
    description: "Neurologist with specialization in brain and nervous system disorders.",
    gender: 'male',
    availableTimeSlots: ['morning', 'afternoon']
  },
  {
    id: "9",
    name: "Dr. Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    specialty: "Emergency Medicine",
    earliestAvailable: new Date("2025-08-16T20:00:00"),
    location: aucklandHospitals[8],
    distance: 1,
    cost: 30,
    rating: 4.8,
    experience: 11,
    description: "Emergency medicine physician with extensive experience in acute care.",
    gender: 'female',
    availableTimeSlots: ['allday']
  },
  {
    id: "10",
    name: "Dr. James Miller",
    avatar: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400&h=400&fit=crop&crop=face",
    specialty: "Family Medicine",
    earliestAvailable: new Date("2025-08-24T13:00:00"),
    location: aucklandHospitals[9],
    distance: 9,
    cost: 28,
    rating: 4.6,
    experience: 13,
    description: "Family medicine physician providing comprehensive care for all ages.",
    gender: 'male',
    availableTimeSlots: ['morning']
  }
];

// 过滤器接口
export interface DoctorFilters {
  gender?: 'male' | 'female' | 'all';
  priceRange?: { min: number; max: number };
  maxDistance?: number;
  timeSlot?: 'morning' | 'afternoon' | 'allday' | 'all';
}

// 搜索和过滤医生函数
export const searchAndFilterDoctors = (query: string, filters: DoctorFilters): Doctor[] => {
  let filteredDoctors = doctorsDatabase;

  // 文本搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm) ||
      doctor.specialty.toLowerCase().includes(searchTerm) ||
      doctor.location.toLowerCase().includes(searchTerm)
    );
  }

  // 性别过滤
  if (filters.gender && filters.gender !== 'all') {
    filteredDoctors = filteredDoctors.filter(doctor => doctor.gender === filters.gender);
  }

  // 价格范围过滤
  if (filters.priceRange) {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.cost >= filters.priceRange!.min && doctor.cost <= filters.priceRange!.max
    );
  }

  // 距离过滤
  if (filters.maxDistance !== undefined) {
    filteredDoctors = filteredDoctors.filter(doctor => doctor.distance <= filters.maxDistance!);
  }

  // 时间段过滤
  if (filters.timeSlot && filters.timeSlot !== 'all') {
    filteredDoctors = filteredDoctors.filter(doctor => 
      doctor.availableTimeSlots.includes(filters.timeSlot as 'morning' | 'afternoon' | 'allday') ||
      doctor.availableTimeSlots.includes('allday')
    );
  }

  return filteredDoctors;
};

// 搜索医生函数（向后兼容）
export const searchDoctors = (query: string): Doctor[] => {
  return searchAndFilterDoctors(query, {});
};

// 根据距离排序
export const sortDoctorsByDistance = (doctors: Doctor[]): Doctor[] => {
  return [...doctors].sort((a, b) => a.distance - b.distance);
};

// 根据费用排序
export const sortDoctorsByCost = (doctors: Doctor[]): Doctor[] => {
  return [...doctors].sort((a, b) => a.cost - b.cost);
};

// 根据评分排序
export const sortDoctorsByRating = (doctors: Doctor[]): Doctor[] => {
  return [...doctors].sort((a, b) => b.rating - a.rating);
};

// 获取时间段显示文本
export const getTimeSlotLabel = (timeSlot: string): string => {
  switch (timeSlot) {
    case 'morning': return 'Morning';
    case 'afternoon': return 'Afternoon';
    case 'allday': return 'All Day';
    default: return timeSlot;
  }
};
