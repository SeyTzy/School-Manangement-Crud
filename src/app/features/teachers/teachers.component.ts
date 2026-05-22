import { Component, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
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
import { DataService } from '../../core/services/data.service';
import { Teacher } from '../../core/models';

@Component({
  selector: 'app-teachers',
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
    MatMenuModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Teachers</h1>
          <p>Manage faculty and staff records</p>
        </div>
        <button mat-flat-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Teacher
        </button>
      </div>

      <mat-card class="table-card">
        <div class="table-header">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search teachers</mat-label>
            <input matInput (input)="applyFilter($event)" placeholder="Search by name, email, department...">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Department</mat-label>
            <mat-select [(value)]="selectedDept" (selectionChange)="filterByDept()">
              <mat-option value="">All Departments</mat-option>
              @for (dept of departments; track dept) {
                <mat-option [value]="dept">{{ dept }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="photo">
              <th mat-header-cell *matHeaderCellDef>Photo</th>
              <td mat-cell *matCellDef="let teacher">
                <div class="avatar-circle green">{{ teacher.firstName[0] }}{{ teacher.lastName[0] }}</div>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
              <td mat-cell *matCellDef="let teacher">
                <div class="name-cell">
                  <span class="primary">{{ teacher.firstName }} {{ teacher.lastName }}</span>
                  <span class="secondary">{{ teacher.email }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="teacherId">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Teacher ID</th>
              <td mat-cell *matCellDef="let teacher">{{ teacher.teacherId }}</td>
            </ng-container>

            <ng-container matColumnDef="department">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
              <td mat-cell *matCellDef="let teacher">
                <mat-chip>{{ teacher.department }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="qualification">
              <th mat-header-cell *matHeaderCellDef>Qualification</th>
              <td mat-cell *matCellDef="let teacher">{{ teacher.qualification }}</td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let teacher">{{ teacher.phone || 'N/A' }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let teacher">
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="editTeacher(teacher)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="deleteTeacher(teacher)">
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

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
      </mat-card>

      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingTeacher() ? 'Edit' : 'Add' }} Teacher</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <form (ngSubmit)="saveTeacher()">
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

                <mat-form-field appearance="outline">
                  <mat-label>Address</mat-label>
                  <input matInput [(ngModel)]="formData.address" name="address">
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline">
                    <mat-label>Department</mat-label>
                    <input matInput [(ngModel)]="formData.department" name="department" required>
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Qualification</mat-label>
                    <input matInput [(ngModel)]="formData.qualification" name="qualification" required>
                  </mat-form-field>
                </div>
              </div>

              <div class="dialog-actions">
                <button mat-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit">
                  {{ editingTeacher() ? 'Update' : 'Add' }} Teacher
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
export class TeachersComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['photo', 'name', 'teacherId', 'department', 'qualification', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Teacher>();
  
  showDialog = signal(false);
  editingTeacher = signal<Teacher | null>(null);
  selectedDept = '';
  departments = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
  formData: any = this.getEmptyForm();

  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    this.dataSource.data = this.dataService.teachers();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByDept() {
    const teachers = this.selectedDept 
      ? this.dataService.teachers().filter(t => t.department === this.selectedDept)
      : this.dataService.teachers();
    this.dataSource.data = teachers;
  }

  openAddDialog() {
    this.editingTeacher.set(null);
    this.formData = this.getEmptyForm();
    this.showDialog.set(true);
  }

  editTeacher(teacher: Teacher) {
    this.editingTeacher.set(teacher);
    this.formData = { ...teacher };
    this.showDialog.set(true);
  }

  deleteTeacher(teacher: Teacher) {
    if (confirm(`Delete ${teacher.firstName} ${teacher.lastName}?`)) {
      this.dataService.deleteTeacher(teacher.id);
      this.dataSource.data = this.dataService.teachers();
    }
  }

  saveTeacher() {
    if (this.editingTeacher()) {
      this.dataService.updateTeacher(this.editingTeacher()!.id, this.formData);
    } else {
      this.dataService.addTeacher({
        ...this.formData,
        role: 'teacher',
        teacherId: `TCH${String(this.dataService.totalTeachers() + 1).padStart(3, '0')}`,
        password: 'pass123',
        subjects: []
      } as any);
    }
    this.dataSource.data = this.dataService.teachers();
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.editingTeacher.set(null);
    this.formData = this.getEmptyForm();
  }

  getEmptyForm() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      qualification: ''
    };
  }
}