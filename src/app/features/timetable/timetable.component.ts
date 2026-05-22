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
          <h1>Schedule</h1>
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
            <div class="timetable-wrap">
              <div class="timetable-grid">
                <div class="t-header">
                  <div class="t-cell time-header">Time</div>
                  @for (day of days; track day) {
                    <div class="t-cell day-header">{{ day }}</div>
                  }
                </div>
                
                @for (period of periods; track period) {
                  <div class="t-row">
                    <div class="t-cell time-cell">
                      <span class="period-num">P{{ period }}</span>
                      <span class="period-time">{{ getTimeSlot(period) }}</span>
                    </div>
                    @for (day of days; track day; let i = $index) {
                      <div class="t-cell schedule-cell" [class]="getCellClass(i, period)">
                        @if (getSubject(i, period)) {
                          <span class="subject-name">{{ getSubject(i, period)?.subjectName }}</span>
                          <span class="subject-teacher">{{ getSubject(i, period)?.teacherName }}</span>
                          <span class="subject-room">{{ getSubject(i, period)?.room }}</span>
                        } @else {
                          <span class="break-label">Break</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
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
:host { display: block; }

.filter-card {
  margin-bottom: 20px;
  border-radius: var(--radius-lg);
}

.filter-card mat-form-field {
  width: 100%;
  max-width: 300px;
}

.timetable-card {
  border-radius: var(--radius-lg);
}

.timetable-wrap {
  overflow-x: auto;
}

.timetable-grid {
  min-width: 650px;
}

.t-header {
  display: grid;
  grid-template-columns: 90px repeat(5, 1fr);
  background: var(--primary);
  color: white;
  border-radius: 8px 8px 0 0;
}

.t-cell {
  padding: 14px 10px;
  font-weight: 600;
  text-align: center;
  font-size: 13px;
}

.time-header, .day-header {
  padding: 14px;
}

.t-row {
  display: grid;
  grid-template-columns: 90px repeat(5, 1fr);
  border-bottom: 1px solid var(--border);
}

.t-row:last-child {
  border-bottom: none;
}

.time-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background);
  border-right: 1px solid var(--border);
  gap: 2px;
}

.period-num {
  font-weight: 700;
  font-size: 16px;
  color: var(--primary);
}

.period-time {
  font-size: 11px;
  color: var(--text-secondary);
}

.schedule-cell {
  padding: 10px 8px;
  text-align: center;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 72px;
}

.schedule-cell:last-child {
  border-right: none;
}

.subject-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
}

.subject-teacher {
  font-size: 11px;
  color: var(--text-secondary);
}

.subject-room {
  font-size: 10px;
  color: var(--text-secondary);
  padding: 2px 6px;
  background: var(--background);
  border-radius: 4px;
}

.break-label {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 12px;
}
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