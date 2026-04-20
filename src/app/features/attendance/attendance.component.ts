import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track and manage student attendance</p>
        </div>
      </div>

      <div class="attendance-grid">
        <mat-card class="mark-card">
          <mat-card-header>
            <mat-card-title>Mark Attendance</mat-card-title>
            <mat-card-subtitle>Select class and date</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="mark-form">
              <mat-form-field appearance="outline">
                <mat-label>Class</mat-label>
                <mat-select [(value)]="selectedClass" (selectionChange)="loadStudents()">
                  @for (cls of classes(); track cls.id) {
                    <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <button mat-flat-button color="primary" (click)="loadStudents()" [disabled]="!selectedClass">
                Load Students
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Today's Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item present">
                <mat-icon>check_circle</mat-icon>
                <span class="value">{{ getPresentCount() }}</span>
                <span class="label">Present</span>
              </div>
              <div class="stat-item absent">
                <mat-icon>cancel</mat-icon>
                <span class="value">{{ getAbsentCount() }}</span>
                <span class="label">Absent</span>
              </div>
              <div class="stat-item late">
                <mat-icon>schedule</mat-icon>
                <span class="value">{{ getLateCount() }}</span>
                <span class="label">Late</span>
              </div>
              <div class="stat-item total">
                <mat-icon>people</mat-icon>
                <span class="value">{{ classStudents().length }}</span>
                <span class="label">Total</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="students-card">
        <mat-card-header>
          <mat-card-title>Student List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (classStudents().length > 0) {
            <table mat-table [dataSource]="classStudents()">
              <ng-container matColumnDef="rollNumber">
                <th mat-header-cell *matHeaderCellDef>Roll No.</th>
                <td mat-cell *matCellDef="let student">{{ student.rollNumber }}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let student">
                  {{ student.firstName }} {{ student.lastName }}
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let student">
                  <mat-chip-listbox [(ngModel)]="attendanceMap[student.id]" (change)="updateAttendance(student.id, $event.value)">
                    <mat-chip-option value="present" selected>Present</mat-chip-option>
                    <mat-chip-option value="absent">Absent</mat-chip-option>
                    <mat-chip-option value="late">Late</mat-chip-option>
                  </mat-chip-listbox>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="studentColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: studentColumns;"></tr>
            </table>

            <div class="submit-section">
              <button mat-flat-button color="primary" (click)="submitAttendance()">
                <mat-icon>save</mat-icon>
                Submit Attendance
              </button>
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon>info</mat-icon>
              <p>Select a class to load students</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .page-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }

    .attendance-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .mark-card, .stats-card, .students-card { border-radius: 12px; }

    .mark-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mark-form mat-form-field { width: 100%; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .stat-item mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .stat-item .value { font-size: 28px; font-weight: 700; }
    .stat-item .label { font-size: 12px; color: var(--text-secondary); }

    .stat-item.present { background: #ECFDF5; color: #059669; }
    .stat-item.absent { background: #FEF2F2; color: #DC2626; }
    .stat-item.late { background: #FFFBEB; color: #D97706; }
    .stat-item.total { background: #EFF6FF; color: #2563EB; }

    table { width: 100%; }

    .submit-section {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
    }

    .submit-section button { display: flex; align-items: center; gap: 8px; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: var(--text-secondary);
    }

    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }

    @media (max-width: 768px) {
      .attendance-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AttendanceComponent {
  selectedClass = '';
  selectedDate = new Date();
  classStudents = signal<any[]>([]);
  attendanceMap: Record<string, string> = {};
  studentColumns = ['rollNumber', 'name', 'status'];

  constructor(private dataService: DataService) {}

  classes = computed(() => this.dataService.classes());

  loadStudents() {
    if (this.selectedClass) {
      const students = this.dataService.getStudentsByClass(this.selectedClass);
      this.classStudents.set(students);
      this.attendanceMap = {};
      students.forEach(s => this.attendanceMap[s.id] = 'present');
    } else {
      this.classStudents.set([]);
    }
  }

  updateAttendance(studentId: string, status: string) {
    this.attendanceMap[studentId] = status;
  }

  getPresentCount() {
    return Object.values(this.attendanceMap).filter(s => s === 'present').length;
  }

  getAbsentCount() {
    return Object.values(this.attendanceMap).filter(s => s === 'absent').length;
  }

  getLateCount() {
    return Object.values(this.attendanceMap).filter(s => s === 'late').length;
  }

  submitAttendance() {
    Object.entries(this.attendanceMap).forEach(([studentId, status]) => {
      this.dataService.addAttendance({
        studentId,
        classId: this.selectedClass,
        date: this.selectedDate,
        status: status as any,
        markedBy: '1'
      });
    });
    alert('Attendance submitted successfully!');
  }
}