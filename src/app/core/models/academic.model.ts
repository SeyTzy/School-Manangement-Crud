export interface Class {
  id: string;
  name: string;
  grade: number;
  section: string;
  academicYear: string;
  classTeacherId?: string;
  roomNumber?: string;
  studentIds: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classIds: string[];
  teacherIds: string[];
  creditHours: number;
}

export interface AcademicYear {
  id: string;
  year: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}