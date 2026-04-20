export interface TimeSlot {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  dayOfWeek: number;
  period: number;
  subjectId: string;
  teacherId: string;
  roomNumber?: string;
}

export interface Timetable {
  classId: string;
  weekSchedule: TimetableEntry[];
}

export interface DaySchedule {
  day: string;
  dayIndex: number;
  periods: PeriodSchedule[];
}

export interface PeriodSchedule {
  period: number;
  time: string;
  subject?: string;
  teacher?: string;
  room?: string;
}