import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-grades',
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
    MatTableModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Grades</h1>
          <p>Record and manage student grades</p>
        </div>
        <button mat-flat-button color="primary" (click)="showAddForm.set(true)">
          <mat-icon>add</mat-icon>
          Add Grade
        </button>
      </div>

      <div class="content-grid">
        <mat-card class="filter-card">
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Class</mat-label>
              <mat-select [(value)]="selectedClass" (selectionChange)="filterGrades()">
                <mat-option value="">All Classes</mat-option>
                @for (cls of classes(); track cls.id) {
                  <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Subject</mat-label>
              <mat-select [(value)]="selectedSubject" (selectionChange)="filterGrades()">
                <mat-option value="">All Subjects</mat-option>
                @for (subj of subjects(); track subj.id) {
                  <mat-option [value]="subj.id">{{ subj.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <mat-card class="grades-card">
          <mat-card-header>
            <mat-card-title>Grade Records</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="filteredGrades()">
                <ng-container matColumnDef="student">
                  <th mat-header-cell *matHeaderCellDef>Student</th>
                  <td mat-cell *matCellDef="let grade">
                    {{ getStudentName(grade.studentId) }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="subject">
                  <th mat-header-cell *matHeaderCellDef>Subject</th>
                  <td mat-cell *matCellDef="let grade">{{ getSubjectName(grade.subjectId) }}</td>
                </ng-container>

                <ng-container matColumnDef="type">
                  <th mat-header-cell *matHeaderCellDef>Type</th>
                  <td mat-cell *matCellDef="let grade">
                    <mat-chip>{{ grade.type }}</mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="title">
                  <th mat-header-cell *matHeaderCellDef>Title</th>
                  <td mat-cell *matCellDef="let grade">{{ grade.title }}</td>
                </ng-container>

                <ng-container matColumnDef="marks">
                  <th mat-header-cell *matHeaderCellDef>Marks</th>
                  <td mat-cell *matCellDef="let grade">
                    <span class="marks">{{ grade.obtainedMarks }}/{{ grade.maxMarks }}</span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="percentage">
                  <th mat-header-cell *matHeaderCellDef>%</th>
                  <td mat-cell *matCellDef="let grade">
                    <span class="percentage" [class]="getGradeClass(grade)">
                      {{ getPercentage(grade) }}%
                    </span>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>

            @if (filteredGrades().length === 0) {
              <div class="empty-state">
                <mat-icon>grade</mat-icon>
                <p>No grades found</p>
              </div>
            }
          </mat-card-content>
        </mat-card>
      </div>

      @if (showAddForm()) {
        <div class="dialog-overlay" (click)="showAddForm.set(false)">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>Add Grade</h2>
              <button mat-icon-button (click)="showAddForm.set(false)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveGrade()">
              <div class="form-body">
                <mat-form-field appearance="outline">
                  <mat-label>Class</mat-label>
                  <mat-select [(value)]="gradeForm.classId" required>
                    @for (cls of classes(); track cls.id) {
                      <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Student</mat-label>
                  <mat-select [(value)]="gradeForm.studentId" required>
                    @for (student of classStudents(); track student.id) {
                      <mat-option [value]="student.id">{{ student.firstName }} {{ student.lastName }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Subject</mat-label>
                  <mat-select [(value)]="gradeForm.subjectId" required>
                    @for (subj of subjects(); track subj.id) {
                      <mat-option [value]="subj.id">{{ subj.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Type</mat-label>
                  <mat-select [(value)]="gradeForm.type" required>
                    <mat-option value="assignment">Assignment</mat-option>
                    <mat-option value="quiz">Quiz</mat-option>
                    <mat-option value="midterm">Midterm</mat-option>
                    <mat-option value="final">Final</mat-option>
                    <mat-option value="project">Project</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Title</mat-label>
                  <input matInput [(ngModel)]="gradeForm.title" name="title" required>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Max Marks</mat-label>
                    <input matInput type="number" [(ngModel)]="gradeForm.maxMarks" name="maxMarks" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Obtained Marks</mat-label>
                    <input matInput type="number" [(ngModel)]="gradeForm.obtainedMarks" name="obtainedMarks" required>
                  </mat-form-field>
                </div>
              </div>

              <div class="dialog-actions">
                <button mat-button type="button" (click)="showAddForm.set(false)">Cancel</button>
                <button mat-flat-button color="primary" type="submit">Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
:host { display: block; }

.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
}

.filter-card, .grades-card {
  border-radius: var(--radius-lg);
}

.filter-card mat-card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.full-width { width: 100%; }

.table-container {
  overflow-x: auto;
}

table { width: 100%; }

.marks {
  font-weight: 600;
  color: var(--text-primary);
}

.percentage {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
}

.percentage.excellent { background: #ECFDF5; color: #059669; }
.percentage.good { background: #EFF6FF; color: #2563EB; }
.percentage.average { background: #FFFBEB; color: #D97706; }
.percentage.poor { background: #FEF2F2; color: #DC2626; }

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class GradesComponent {
  selectedClass = '';
  selectedSubject = '';
  showAddForm = signal(false);
  displayedColumns = ['student', 'subject', 'type', 'title', 'marks', 'percentage'];
  gradeForm: any = this.getEmptyForm();

  constructor(private dataService: DataService) {}

  classes = computed(() => this.dataService.classes());
  subjects = computed(() => this.dataService.subjects());
  allGrades = computed(() => this.dataService.grades());

  classStudents = computed(() => {
    if (!this.selectedClass) return [];
    return this.dataService.getStudentsByClass(this.selectedClass);
  });

  filteredGrades = computed(() => {
    let grades = this.allGrades();
    if (this.selectedClass) {
      grades = grades.filter(g => g.classId === this.selectedClass);
    }
    if (this.selectedSubject) {
      grades = grades.filter(g => g.subjectId === this.selectedSubject);
    }
    return grades;
  });

  filterGrades() {}

  getStudentName(studentId: string) {
    const student = this.dataService.getStudentById(studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'N/A';
  }

  getSubjectName(subjectId: string) {
    const subj = this.dataService.getSubjectById(subjectId);
    return subj?.name || 'N/A';
  }

  getPercentage(grade: any) {
    return Math.round((grade.obtainedMarks / grade.maxMarks) * 100);
  }

  getGradeClass(grade: any) {
    const pct = this.getPercentage(grade);
    if (pct >= 90) return 'excellent';
    if (pct >= 75) return 'good';
    if (pct >= 60) return 'average';
    return 'poor';
  }

  saveGrade() {
    this.dataService.addGrade({
      ...this.gradeForm,
      weightage: 10,
      gradedBy: '1'
    });
    this.showAddForm.set(false);
    this.gradeForm = this.getEmptyForm();
  }

  getEmptyForm() {
    return {
      classId: '',
      studentId: '',
      subjectId: '',
      type: 'assignment',
      title: '',
      maxMarks: 100,
      obtainedMarks: 0
    };
  }
}