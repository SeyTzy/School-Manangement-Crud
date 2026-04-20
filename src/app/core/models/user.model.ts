export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  photoUrl?: string;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  classId: string;
  rollNumber: number;
  dateOfBirth: Date;
  parentId?: string;
  emergencyContact?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  department: string;
  qualification: string;
  subjects: string[];
}

export interface Parent extends User {
  role: 'parent';
  parentId: string;
  studentIds: string[];
  occupation?: string;
}

export interface Admin extends User {
  role: 'admin';
  adminId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}