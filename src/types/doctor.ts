// 医生预约相关的类型定义

export interface Doctor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  earliestAvailable: Date;
  location: string;
  distance: number; // in km
  cost: number; // in dollars
  rating: number;
  experience: number; // years
  description?: string;
  gender: 'male' | 'female';
  availableTimeSlots: ('morning' | 'afternoon' | 'allday')[];
}

export interface AppointmentSlot {
  id: string;
  doctorId: string;
  date: Date;
  time: string;
  available: boolean;
}
