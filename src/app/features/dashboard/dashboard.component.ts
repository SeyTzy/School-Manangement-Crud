import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    BaseChartDirective
  ],
  // eslint-disable-next-line max-len
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Welcome back, {{ userName() }}</h1>
          <p>Here's what's happening at your school today</p>
        </div>
        @if (isAdmin()) {
          <button mat-flat-button color="primary" routerLink="/students/add">
            <mat-icon>add</mat-icon>
            Add Student
          </button>
        }
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <mat-icon>school</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalStudents() }}</span>
            <span class="stat-label">Total Students</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            +12%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <mat-icon>person</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalTeachers() }}</span>
            <span class="stat-label">Total Teachers</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            +5%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <mat-icon>class</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalClasses() }}</span>
            <span class="stat-label">Total Classes</span>
          </div>
          <div class="stat-trend neutral">
            <mat-icon>remove</mat-icon>
            0%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">
            <mat-icon>fact_check</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ averageAttendance() }}%</span>
            <span class="stat-label">Attendance</span>
          </div>
          <div class="stat-trend up">
            <mat-icon>trending_up</mat-icon>
            +3%
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Enrollment Trends</mat-card-title>
            <mat-card-subtitle>Monthly student enrollments</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="enrollmentChartData"
                [options]="lineChartOptions"
                [type]="lineChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Attendance Overview</mat-card-title>
            <mat-card-subtitle>Current month statistics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="attendanceChartData"
                [options]="doughnutChartOptions"
                [type]="doughnutChartType">
              </canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="bottom-grid">
        <mat-card class="quick-actions">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="actions-grid">
              <button class="action-btn" routerLink="/attendance">
                <mat-icon>fact_check</mat-icon>
                <span>Mark Attendance</span>
              </button>
              <button class="action-btn" routerLink="/grades">
                <mat-icon>grade</mat-icon>
                <span>Record Grades</span>
              </button>
              <button class="action-btn" routerLink="/timetable">
                <mat-icon>schedule</mat-icon>
                <span>Timetable</span>
              </button>
              <button class="action-btn" routerLink="/announcements">
                <mat-icon>campaign</mat-icon>
                <span>Announcements</span>
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="recent-activity">
          <mat-card-header>
            <mat-card-title>Recent Students</mat-card-title>
            <mat-card-subtitle>Latest enrolled students</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="student-list">
              @for (student of recentStudents(); track student.id) {
                <div class="student-item">
                  <div class="avatar-circle primary">
                    {{ student.firstName[0] }}{{ student.lastName[0] }}
                  </div>
                  <div class="student-info">
                    <span class="name">{{ student.firstName }} {{ student.lastName }}</span>
                    <span class="class">Class {{ getClassName(student.classId) }}</span>
                  </div>
                  <span class="student-roll">{{ student.rollNumber }}</span>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: pageEnter 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      border-radius: var(--radius-lg);
    }

    .chart-card mat-card-header {
      margin-bottom: 12px;
    }

    .chart-wrapper {
      position: relative;
      max-height: 280px;
    }

    .chart-wrapper canvas {
      max-height: 280px;
    }

    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 20px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-primary);
      font-family: inherit;
    }

    .action-btn:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
    }

    .action-btn mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .action-btn span {
      font-size: 13px;
      font-weight: 500;
    }

    .student-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .student-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: var(--background);
      border-radius: var(--radius-md);
      transition: background 0.2s;
    }

    .student-item:hover {
      background: var(--primary-light);
    }

    .student-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .student-info .name {
      font-weight: 500;
      font-size: 14px;
      color: var(--text-primary);
    }

    .student-info .class {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .student-roll {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 2px 8px;
      background: var(--surface);
      border-radius: 4px;
      border: 1px solid var(--border);
    }

    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .chart-wrapper {
        max-height: 220px;
      }

      .chart-wrapper canvas {
        max-height: 220px;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        gap: 12px;
      }
    }
  `]
})
export class DashboardComponent {
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  userName = computed(() => {
    const user = this.authService.user();
    return user?.firstName || 'User';
  });

  isAdmin = computed(() => this.authService.hasRole(['admin']));

  totalStudents = computed(() => this.dataService.totalStudents());
  totalTeachers = computed(() => this.dataService.totalTeachers());
  totalClasses = computed(() => this.dataService.totalClasses());
  averageAttendance = computed(() => this.dataService.averageAttendance());

  recentStudents = computed(() => this.dataService.students().slice(0, 4));

  getClassName(classId: string) {
    const cls = this.dataService.getClassById(classId);
    return cls?.name || 'N/A';
  }

  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  enrollmentChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [65, 72, 78, 82, 88, 95],
      label: 'Students',
      fill: true,
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4
    }]
  };

  doughnutChartType: ChartType = 'doughnut';
  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  attendanceChartData: ChartConfiguration['data'] = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      data: [85, 10, 5],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B']
    }]
  };
}