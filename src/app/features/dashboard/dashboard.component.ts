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
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1>Welcome back, {{ userName() }}</h1>
          <p>Here's what's happening at your school today</p>
        </div>
        <div class="header-actions">
          @if (isAdmin()) {
            <button mat-flat-button color="primary" routerLink="/students/add">
              <mat-icon>add</mat-icon>
              Add Student
            </button>
          }
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon students">
            <mat-icon>school</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalStudents() }}</span>
            <span class="stat-label">Total Students</span>
          </div>
          <div class="stat-trend positive">
            <mat-icon>trending_up</mat-icon>
            +12%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon teachers">
            <mat-icon>person</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalTeachers() }}</span>
            <span class="stat-label">Total Teachers</span>
          </div>
          <div class="stat-trend positive">
            <mat-icon>trending_up</mat-icon>
            +5%
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon classes">
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
          <div class="stat-icon attendance">
            <mat-icon>fact_check</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ averageAttendance() }}%</span>
            <span class="stat-label">Attendance</span>
          </div>
          <div class="stat-trend positive">
            <mat-icon>trending_up</mat-icon>
            +3%
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Enrollment Trends</mat-card-title>
            <mat-card-subtitle>Monthly student enrollments</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="enrollmentChartData"
              [options]="lineChartOptions"
              [type]="lineChartType">
            </canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Attendance Overview</mat-card-title>
            <mat-card-subtitle>Current month statistics</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <canvas baseChart
              [data]="attendanceChartData"
              [options]="doughnutChartOptions"
              [type]="doughnutChartType">
            </canvas>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions & Recent Activity -->
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
                  <div class="student-avatar">
                    {{ student.firstName[0] }}{{ student.lastName[0] }}
                  </div>
                  <div class="student-info">
                    <span class="name">{{ student.firstName }} {{ student.lastName }}</span>
                    <span class="class">Class {{ getClassName(student.classId) }}</span>
                  </div>
                  <mat-chip>{{ student.rollNumber }}</mat-chip>
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
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }

    .page-header p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .header-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--surface);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-icon.students { background: linear-gradient(135deg, #2563EB, #3B82F6); }
    .stat-icon.teachers { background: linear-gradient(135deg, #059669, #10B981); }
    .stat-icon.classes { background: linear-gradient(135deg, #7C3AED, #8B5CF6); }
    .stat-icon.attendance { background: linear-gradient(135deg, #F59E0B, #FBBF24); }

    .stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
    }

    .stat-trend mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .stat-trend.positive { color: #10B981; }
    .stat-trend.negative { color: #EF4444; }
    .stat-trend.neutral { color: var(--text-secondary); }

    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      border-radius: 12px;
    }

    .chart-card mat-card-header {
      margin-bottom: 16px;
    }

    .chart-card canvas {
      max-height: 280px;
    }

    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .quick-actions, .recent-activity {
      border-radius: 12px;
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
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary);
    }

    .action-btn mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .action-btn span {
      font-size: 13px;
      font-weight: 500;
    }

    .student-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .student-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--background);
      border-radius: 8px;
    }

    .student-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }

    .student-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .student-info .name {
      font-weight: 500;
      color: var(--text-primary);
    }

    .student-info .class {
      font-size: 12px;
      color: var(--text-secondary);
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
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .header-actions {
        width: 100%;
      }

      .header-actions button {
        width: 100%;
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