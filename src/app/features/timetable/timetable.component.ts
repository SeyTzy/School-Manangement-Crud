import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Timetable</h1>
          <p>View class schedules and periods</p>
        </div>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <mat-form-field appearance="outline">
            <mat-label>Select Class</mat-label>
            <mat-select [(value)]="selectedClass" (selectionChange)="loadTimetable()">
              @for (cls of classes(); track cls.id) {
                <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <mat-card class="timetable-card">
        <mat-card-content>
          @if (selectedClass) {
            <div class="timetable-grid">
              <div class="timetable-header">
                <div class="time-col">Time</div>
                @for (day of days; track day) {
                  <div class="day-col">{{ day }}</div>
                }
              </div>
              
              @for (period of periods; track period) {
                <div class="timetable-row">
                  <div class="time-cell">
                    <span class="period-num">{{ period }}</span>
                    <span class="time">{{ getTimeSlot(period) }}</span>
                  </div>
                  @for (day of days; track day; let i = $index) {
                    <div class="schedule-cell" [class]="getCellClass(i, period)">
                      @if (getSubject(i, period)) {
                        <span class="subject">{{ getSubject(i, period)?.subjectName }}</span>
                        <span class="teacher">{{ getSubject(i, period)?.teacherName }}</span>
                        <span class="room">{{ getSubject(i, period)?.room }}</span>
                      } @else {
                        <span class="break">Break</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <mat-icon>schedule</mat-icon>
              <p>Select a class to view timetable</p>
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

    .filter-card { margin-bottom: 24px; border-radius: 12px; }
    .filter-card mat-form-field { width: 100%; max-width: 300px; }

    .timetable-card { border-radius: 12px; }

    .timetable-grid {
      overflow-x: auto;
    }

    .timetable-header {
      display: grid;
      grid-template-columns: 100px repeat(5, 1fr);
      background: var(--primary);
      color: white;
      border-radius: 8px 8px 0 0;
    }

    .time-col, .day-col {
      padding: 16px;
      font-weight: 600;
      text-align: center;
    }

    .timetable-row {
      display: grid;
      grid-template-columns: 100px repeat(5, 1fr);
      border-bottom: 1px solid var(--border);
    }

    .timetable-row:last-child { border-bottom: none; }

    .time-cell {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--background);
      border-right: 1px solid var(--border);
    }

    .period-num {
      font-weight: 700;
      font-size: 18px;
      color: var(--primary);
    }

    .time {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .schedule-cell {
      padding: 12px;
      text-align: center;
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-height: 80px;
      justify-content: center;
    }

    .schedule-cell:last-child { border-right: none; }

    .schedule-cell .subject {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 14px;
    }

    .schedule-cell .teacher {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .schedule-cell .room {
      font-size: 11px;
      color: var(--text-secondary);
      padding: 2px 6px;
      background: var(--background);
      border-radius: 4px;
    }

    .schedule-cell.break .break {
      color: var(--text-secondary);
      font-style: italic;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: var(--text-secondary);
    }

    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
  `]
})
export class TimetableComponent {
  selectedClass = '1';
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods = [1, 2, 3, 4, 5, 6];

  timeSlots: Record<number, string> = {
    1: '08:00 - 08:45',
    2: '08:45 - 09:30',
    3: '09:45 - 10:30',
    4: '10:30 - 11:15',
    5: '11:30 - 12:15',
    6: '12:15 - 13:00'
  };

  private scheduleData: any[] = [];

  constructor(private dataService: DataService) {
    this.loadTimetable();
  }

  classes = computed(() => this.dataService.classes());

  loadTimetable() {
    if (this.selectedClass) {
      this.scheduleData = this.dataService.getTimetableByClass(this.selectedClass);
    }
  }

  getTimeSlot(period: number) {
    return this.timeSlots[period] || '';
  }

  getSubject(dayIndex: number, period: number) {
    const entry = this.scheduleData.find(
      s => s.dayOfWeek === dayIndex + 1 && s.period === period
    );
    if (!entry) {
      if (period === 4) {
        return { subjectName: 'Lunch', teacherName: '', room: '' };
      }
      return null;
    }

    const subject = this.dataService.getSubjectById(entry.subjectId);
    const teacher = this.dataService.getTeacherById(entry.teacherId);
    return {
      subjectName: subject?.name || 'N/A',
      teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A',
      room: entry.roomNumber || 'N/A'
    };
  }

  getCellClass(dayIndex: number, period: number) {
    if (period === 4) return 'break';
    return '';
  }
}