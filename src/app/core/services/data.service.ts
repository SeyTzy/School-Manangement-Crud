import { Injectable, signal, computed } from '@angular/core';
import { Student, Teacher, Class, Subject, AcademicYear, Attendance, Grade, TimetableEntry, Notification, Announcement } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _students = signal<Student[]>([
    {
      id: '1', email: 'alex@example.com', password: 'pass123', firstName: 'Alex', lastName: 'Johnson',
      role: 'student', phone: '555-1001', address: '123 Main St', createdAt: new Date(),
      studentId: 'STU001', classId: '1', rollNumber: 1, dateOfBirth: new Date('2010-05-15'),
      parentId: '1', emergencyContact: '555-9001'
    },
    {
      id: '2', email: 'emma@example.com', password: 'pass123', firstName: 'Emma', lastName: 'Wilson',
      role: 'student', phone: '555-1002', address: '124 Main St', createdAt: new Date(),
      studentId: 'STU002', classId: '1', rollNumber: 2, dateOfBirth: new Date('2010-08-22'),
      parentId: '2', emergencyContact: '555-9002'
    },
    {
      id: '3', email: 'james@example.com', password: 'pass123', firstName: 'James', lastName: 'Brown',
      role: 'student', phone: '555-1003', address: '125 Main St', createdAt: new Date(),
      studentId: 'STU003', classId: '1', rollNumber: 3, dateOfBirth: new Date('2010-03-10'),
      parentId: '3', emergencyContact: '555-9003'
    },
    {
      id: '4', email: 'olivia@example.com', password: 'pass123', firstName: 'Olivia', lastName: 'Davis',
      role: 'student', phone: '555-1004', address: '126 Main St', createdAt: new Date(),
      studentId: 'STU004', classId: '2', rollNumber: 1, dateOfBirth: new Date('2010-11-05'),
      parentId: '4', emergencyContact: '555-9004'
    },
    {
      id: '5', email: 'william@example.com', password: 'pass123', firstName: 'William', lastName: 'Miller',
      role: 'student', phone: '555-1005', address: '127 Main St', createdAt: new Date(),
      studentId: 'STU005', classId: '2', rollNumber: 2, dateOfBirth: new Date('2010-07-18'),
      parentId: '5', emergencyContact: '555-9005'
    }
  ]);

  private _teachers = signal<Teacher[]>([
    {
      id: '1', email: 'sarah.johnson@example.com', password: 'pass123', firstName: 'Sarah', lastName: 'Johnson',
      role: 'teacher', phone: '555-2001', address: '321 Oak Ave', createdAt: new Date(),
      teacherId: 'TCH001', department: 'Mathematics', qualification: 'M.Sc. Mathematics', subjects: ['Math-1', 'Math-2']
    },
    {
      id: '2', email: 'michael.chen@example.com', password: 'pass123', firstName: 'Michael', lastName: 'Chen',
      role: 'teacher', phone: '555-2002', address: '322 Oak Ave', createdAt: new Date(),
      teacherId: 'TCH002', department: 'Science', qualification: 'M.Sc. Physics', subjects: ['Science-1', 'Science-2']
    },
    {
      id: '3', email: 'lisa.anderson@example.com', password: 'pass123', firstName: 'Lisa', lastName: 'Anderson',
      role: 'teacher', phone: '555-2003', address: '323 Oak Ave', createdAt: new Date(),
      teacherId: 'TCH003', department: 'English', qualification: 'M.A. English', subjects: ['English-1', 'English-2']
    },
    {
      id: '4', email: 'david.kumar@example.com', password: 'pass123', firstName: 'David', lastName: 'Kumar',
      role: 'teacher', phone: '555-2004', address: '324 Oak Ave', createdAt: new Date(),
      teacherId: 'TCH004', department: 'History', qualification: 'M.A. History', subjects: ['History-1', 'History-2']
    }
  ]);

  private _classes = signal<Class[]>([
    { id: '1', name: 'Class 5-A', grade: 5, section: 'A', academicYear: '2025-2026', classTeacherId: '1', roomNumber: 'Room 101', studentIds: ['1', '2', '3'] },
    { id: '2', name: 'Class 5-B', grade: 5, section: 'B', academicYear: '2025-2026', classTeacherId: '2', roomNumber: 'Room 102', studentIds: ['4', '5'] },
    { id: '3', name: 'Class 6-A', grade: 6, section: 'A', academicYear: '2025-2026', classTeacherId: '3', roomNumber: 'Room 201', studentIds: [] }
  ]);

  private _subjects = signal<Subject[]>([
    { id: '1', name: 'Mathematics', code: 'MATH', classIds: ['1', '2', '3'], teacherIds: ['1'], creditHours: 5 },
    { id: '2', name: 'Science', code: 'SCI', classIds: ['1', '2', '3'], teacherIds: ['2'], creditHours: 4 },
    { id: '3', name: 'English', code: 'ENG', classIds: ['1', '2', '3'], teacherIds: ['3'], creditHours: 4 },
    { id: '4', name: 'History', code: 'HIS', classIds: ['1', '2', '3'], teacherIds: ['4'], creditHours: 3 }
  ]);

  private _academicYears = signal<AcademicYear[]>([
    { id: '1', year: '2025-2026', startDate: new Date('2025-04-01'), endDate: new Date('2026-03-31'), isActive: true }
  ]);

  private _attendance = signal<Attendance[]>([
    { id: '1', studentId: '1', classId: '1', date: new Date(), status: 'present', markedBy: '1' },
    { id: '2', studentId: '2', classId: '1', date: new Date(), status: 'present', markedBy: '1' },
    { id: '3', studentId: '3', classId: '1', date: new Date(), status: 'absent', markedBy: '1' },
    { id: '4', studentId: '4', classId: '2', date: new Date(), status: 'present', markedBy: '2' },
    { id: '5', studentId: '5', classId: '2', date: new Date(), status: 'late', markedBy: '2' }
  ]);

  private _grades = signal<Grade[]>([
    { id: '1', studentId: '1', classId: '1', subjectId: '1', type: 'assignment', title: 'Homework 1', maxMarks: 20, obtainedMarks: 18, weightage: 10, gradedBy: '1', gradedAt: new Date() },
    { id: '2', studentId: '1', classId: '1', subjectId: '1', type: 'quiz', title: 'Quiz 1', maxMarks: 10, obtainedMarks: 8, weightage: 10, gradedBy: '1', gradedAt: new Date() },
    { id: '3', studentId: '1', classId: '1', subjectId: '1', type: 'midterm', title: 'Midterm', maxMarks: 100, obtainedMarks: 85, weightage: 30, gradedBy: '1', gradedAt: new Date() },
    { id: '4', studentId: '2', classId: '1', subjectId: '1', type: 'assignment', title: 'Homework 1', maxMarks: 20, obtainedMarks: 15, weightage: 10, gradedBy: '1', gradedAt: new Date() }
  ]);

  private _notifications = signal<Notification[]>([
    { id: '1', userId: '1', type: 'announcement', title: 'Welcome to EduCore', message: 'Welcome to the new School Management System!', isRead: false, createdAt: new Date(), senderId: 'admin' },
    { id: '2', userId: '1', type: 'grade', title: 'Grade Posted', message: 'Your Math midterm grade has been posted.', isRead: false, createdAt: new Date(Date.now() - 86400000), senderId: '1', senderName: 'Sarah Johnson' },
    { id: '3', userId: '1', type: 'attendance', title: 'Attendance Alert', message: 'You have 2 absences this month.', isRead: true, createdAt: new Date(Date.now() - 172800000), senderId: 'admin' }
  ]);

  private _announcements = signal<Announcement[]>([
    { id: '1', title: 'School Annual Day', message: 'Annual Day celebration will be held on December 15th. All students must participate.', priority: 'high', targetRoles: ['student', 'parent'], createdBy: '1', createdAt: new Date() },
    { id: '2', title: 'Exam Schedule', message: 'Mid-term exams will begin from November 1st. Check the timetable for details.', priority: 'normal', targetRoles: ['student'], createdBy: '1', createdAt: new Date() },
    { id: '3', title: 'Holiday Notice', message: 'School will remain closed on 15th August for Independence Day.', priority: 'normal', targetRoles: ['admin', 'teacher', 'student', 'parent'], createdBy: '1', createdAt: new Date() }
  ]);

  private _timetable = signal<TimetableEntry[]>([
    { id: '1', classId: '1', dayOfWeek: 1, period: 1, subjectId: '1', teacherId: '1', roomNumber: 'Room 101' },
    { id: '2', classId: '1', dayOfWeek: 1, period: 2, subjectId: '2', teacherId: '2', roomNumber: 'Lab 1' },
    { id: '3', classId: '1', dayOfWeek: 1, period: 3, subjectId: '3', teacherId: '3', roomNumber: 'Room 101' },
    { id: '4', classId: '1', dayOfWeek: 1, period: 4, subjectId: '4', teacherId: '4', roomNumber: 'Room 102' },
    { id: '5', classId: '1', dayOfWeek: 2, period: 1, subjectId: '3', teacherId: '3', roomNumber: 'Room 101' },
    { id: '6', classId: '1', dayOfWeek: 2, period: 2, subjectId: '1', teacherId: '1', roomNumber: 'Room 101' },
    { id: '7', classId: '1', dayOfWeek: 2, period: 3, subjectId: '2', teacherId: '2', roomNumber: 'Lab 1' },
    { id: '8', classId: '1', dayOfWeek: 2, period: 4, subjectId: '4', teacherId: '4', roomNumber: 'Room 102' }
  ]);

  readonly students = computed(() => this._students());
  readonly teachers = computed(() => this._teachers());
  readonly classes = computed(() => this._classes());
  readonly subjects = computed(() => this._subjects());
  readonly academicYears = computed(() => this._academicYears());
  readonly attendance = computed(() => this._attendance());
  readonly grades = computed(() => this._grades());
  readonly notifications = computed(() => this._notifications());
  readonly announcements = computed(() => this._announcements());
  readonly timetable = computed(() => this._timetable());

  readonly totalStudents = computed(() => this._students().length);
  readonly totalTeachers = computed(() => this._teachers().length);
  readonly totalClasses = computed(() => this._classes().length);
  readonly averageAttendance = computed(() => {
    const att = this._attendance();
    if (att.length === 0) return 0;
    const present = att.filter(a => a.status === 'present' || a.status === 'late').length;
    return Math.round((present / att.length) * 100);
  });

  getStudentById(id: string) {
    return this._students().find(s => s.id === id);
  }

  getTeacherById(id: string) {
    return this._teachers().find(t => t.id === id);
  }

  getClassById(id: string) {
    return this._classes().find(c => c.id === id);
  }

  getSubjectById(id: string) {
    return this._subjects().find(s => s.id === id);
  }

  getStudentsByClass(classId: string) {
    return this._students().filter(s => s.classId === classId);
  }

  addStudent(student: Omit<Student, 'id' | 'createdAt'>) {
    const newStudent: Student = {
      ...student,
      id: String(this._students().length + 1),
      createdAt: new Date()
    } as Student;
    this._students.update(s => [...s, newStudent]);
    return newStudent;
  }

  updateStudent(id: string, data: Partial<Student>) {
    this._students.update(students =>
      students.map(s => s.id === id ? { ...s, ...data } : s)
    );
  }

  deleteStudent(id: string) {
    this._students.update(s => s.filter(student => student.id !== id));
  }

  addTeacher(teacher: Omit<Teacher, 'id' | 'createdAt'>) {
    const newTeacher: Teacher = {
      ...teacher,
      id: String(this._teachers().length + 1),
      createdAt: new Date()
    } as Teacher;
    this._teachers.update(t => [...t, newTeacher]);
    return newTeacher;
  }

  updateTeacher(id: string, data: Partial<Teacher>) {
    this._teachers.update(teachers =>
      teachers.map(t => t.id === id ? { ...t, ...data } : t)
    );
  }

  deleteTeacher(id: string) {
    this._teachers.update(t => t.filter(teacher => teacher.id !== id));
  }

  addClass(classData: Omit<Class, 'id'>) {
    const newClass: Class = {
      ...classData,
      id: String(this._classes().length + 1)
    };
    this._classes.update(c => [...c, newClass]);
    return newClass;
  }

  updateClass(id: string, data: Partial<Class>) {
    this._classes.update(classes =>
      classes.map(c => c.id === id ? { ...c, ...data } : c)
    );
  }

  deleteClass(id: string) {
    this._classes.update(c => c.filter(cls => cls.id !== id));
  }

  addAttendance(attendance: Omit<Attendance, 'id'>) {
    const newAttendance: Attendance = {
      ...attendance,
      id: String(this._attendance().length + 1)
    };
    this._attendance.update(a => [...a, newAttendance]);
    return newAttendance;
  }

  getAttendanceByStudent(studentId: string) {
    return this._attendance().filter(a => a.studentId === studentId);
  }

  addGrade(grade: Omit<Grade, 'id' | 'gradedAt'>) {
    const newGrade: Grade = {
      ...grade,
      id: String(this._grades().length + 1),
      gradedAt: new Date()
    };
    this._grades.update(g => [...g, newGrade]);
    return newGrade;
  }

  getGradesByStudent(studentId: string) {
    return this._grades().filter(g => g.studentId === studentId);
  }

  markNotificationAsRead(id: string) {
    this._notifications.update(n =>
      n.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
    );
  }

  getTimetableByClass(classId: string) {
    return this._timetable().filter(t => t.classId === classId);
  }

  searchStudents(query: string) {
    const q = query.toLowerCase();
    return this._students().filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.studentId.toLowerCase().includes(q)
    );
  }

  searchTeachers(query: string) {
    const q = query.toLowerCase();
    return this._teachers().filter(t =>
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    );
  }
}