export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  subjectId?: string;
  date: Date;
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  subjectId?: string;
  date: Date;
  teacherId: string;
  attendanceList: Attendance[];
  isSubmitted: boolean;
}

export interface AttendanceSummary {
  studentId: string;
  classId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}