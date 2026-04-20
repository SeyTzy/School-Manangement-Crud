export type GradeType = 'assignment' | 'quiz' | 'midterm' | 'final' | 'project' | 'participation';

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  type: GradeType;
  title: string;
  maxMarks: number;
  obtainedMarks: number;
  weightage: number;
  gradedBy: string;
  gradedAt: Date;
  remarks?: string;
}

export interface GradeReport {
  studentId: string;
  classId: string;
  subjectId: string;
  grades: Grade[];
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  gradePoint?: number;
  letterGrade?: string;
}

export interface ClassGradeSummary {
  classId: string;
  subjectId: string;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}