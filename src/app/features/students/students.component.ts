import { Component, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { DataService } from '../../core/services/data.service';
import { Student } from '../../core/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage student records and information</p>
        </div>
        <button mat-flat-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Student
        </button>
      </div>

      <mat-card class="table-card">
        <div class="table-header">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search students</mat-label>
            <input matInput (input)="applyFilter($event)" placeholder="Search by name, email, ID...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Class</mat-label>
            <mat-select [(value)]="selectedClass" (selectionChange)="filterByClass()">
              <mat-option value="">All Classes</mat-option>
              @for (cls of classes(); track cls.id) {
                <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="photo">
              <th mat-header-cell *matHeaderCellDef>Photo</th>
              <td mat-cell *matCellDef="let student">
                <div class="avatar-circle primary">{{ student.firstName[0] }}{{ student.lastName[0] }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let student">
                <div class="name-cell">
                  <span class="primary">{{ student.firstName }} {{ student.lastName }}</span>
                  <span class="secondary">{{ student.email }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="studentId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Student ID</th>
              <td mat-cell *matCellDef="let student">{{ student.studentId }}</td>
            </ng-container>

            <ng-container matColumnDef="class">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Class</th>
              <td mat-cell *matCellDef="let student">{{ getClassName(student.classId) }}</td>
            </ng-container>

            <ng-container matColumnDef="rollNumber">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Roll No.</th>
              <td mat-cell *matCellDef="let student">{{ student.rollNumber }}</td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let student">{{ student.phone || 'N/A' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let student">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="viewStudent(student)">
                    <mat-icon>visibility</mat-icon>
                    <span>View</span>
                  </button>
                  <button mat-menu-item (click)="editStudent(student)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteStudent(student)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons></mat-paginator>
      </mat-card>

      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingStudent() ? 'Edit' : 'Add' }} Student</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <form (ngSubmit)="saveStudent()">
              <div class="form-body">
                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>First Name</mat-label>
                    <input matInput [(ngModel)]="formData.firstName" name="firstName" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Last Name</mat-label>
                    <input matInput [(ngModel)]="formData.lastName" name="lastName" required>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" [(ngModel)]="formData.email" name="email" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Phone</mat-label>
                    <input matInput [(ngModel)]="formData.phone" name="phone">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Class</mat-label>
                    <mat-select [(ngModel)]="formData.classId" name="classId" required>
                      @for (cls of classes(); track cls.id) {
                        <mat-option [value]="cls.id">{{ cls.name }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Roll Number</mat-label>
                    <input matInput type="number" [(ngModel)]="formData.rollNumber" name="rollNumber" required>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline">
                  <mat-label>Address</mat-label>
                  <input matInput [(ngModel)]="formData.address" name="address">
                </mat-form-field>
              </div>

              <div class="dialog-actions">
                <button mat-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit">
                  {{ editingStudent() ? 'Update' : 'Add' }} Student
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class StudentsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['photo', 'name', 'studentId', 'class', 'rollNumber', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Student>();
  
  showDialog = signal(false);
  editingStudent = signal<Student | null>(null);
  selectedClass = '';
  formData: any = this.getEmptyForm();

  constructor(
    private dataService: DataService
  ) {}

  classes = computed(() => this.dataService.classes());

  ngAfterViewInit() {
    this.dataSource.data = this.dataService.students();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByClass() {
    if (this.selectedClass) {
      this.dataSource.data = this.dataService.getStudentsByClass(this.selectedClass);
    } else {
      this.dataSource.data = this.dataService.students();
    }
  }

  getClassName(classId: string) {
    const cls = this.dataService.getClassById(classId);
    return cls?.name || 'N/A';
  }

  openAddDialog() {
    this.editingStudent.set(null);
    this.formData = this.getEmptyForm();
    this.showDialog.set(true);
  }

  editStudent(student: Student) {
    this.editingStudent.set(student);
    this.formData = { ...student };
    this.showDialog.set(true);
  }

  viewStudent(student: Student) {
    this.editStudent(student);
  }

  deleteStudent(student: Student) {
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      this.dataService.deleteStudent(student.id);
      this.dataSource.data = this.dataService.students();
    }
  }

  saveStudent() {
    if (this.editingStudent()) {
      this.dataService.updateStudent(this.editingStudent()!.id, this.formData);
    } else {
      this.dataService.addStudent({
        ...this.formData,
        role: 'student',
        studentId: `STU${String(this.dataService.totalStudents() + 1).padStart(3, '0')}`,
        password: 'pass123'
      } as any);
    }
    this.dataSource.data = this.dataService.students();
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.editingStudent.set(null);
    this.formData = this.getEmptyForm();
  }

  getEmptyForm() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      classId: '',
      rollNumber: null,
      dateOfBirth: null,
      parentId: '',
      emergencyContact: ''
    };
  }
}