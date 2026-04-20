import { Component, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatMenuModule } from '@angular/material/menu';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
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
    MatMenuModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Classes</h1>
          <p>Manage class sections and sections</p>
        </div>
        <button mat-flat-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Class
        </button>
      </div>

      <mat-card class="table-card">
        <table mat-table [dataSource]="dataSource" matSort>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Class Name</th>
            <td mat-cell *matCellDef="let cls">{{ cls.name }}</td>
          </ng-container>

          <ng-container matColumnDef="grade">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Grade</th>
            <td mat-cell *matCellDef="let cls">Grade {{ cls.grade }}</td>
          </ng-container>

          <ng-container matColumnDef="section">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Section</th>
            <td mat-cell *matCellDef="let cls">{{ cls.section }}</td>
          </ng-container>

          <ng-container matColumnDef="academicYear">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Academic Year</th>
            <td mat-cell *matCellDef="let cls">{{ cls.academicYear }}</td>
          </ng-container>

          <ng-container matColumnDef="students">
            <th mat-header-cell *matHeaderCellDef>Students</th>
            <td mat-cell *matCellDef="let cls">{{ cls.studentIds?.length || 0 }}</td>
          </ng-container>

          <ng-container matColumnDef="room">
            <th mat-header-cell *matHeaderCellDef>Room</th>
            <td mat-cell *matCellDef="let cls">{{ cls.roomNumber || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let cls">
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editClass(cls)">
                  <mat-icon>edit</mat-icon>
                  <span>Edit</span>
                </button>
                <button mat-menu-item (click)="deleteClass(cls)">
                  <mat-icon>delete</mat-icon>
                  <span>Delete</span>
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
      </mat-card>

      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingClass() ? 'Edit' : 'Add' }} Class</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form (ngSubmit)="saveClass()" class="class-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Grade</mat-label>
                  <mat-select [(value)]="formData.grade" required>
                    @for (g of grades; track g) {
                      <mat-option [value]="g">{{ g }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Section</mat-label>
                  <input matInput [(ngModel)]="formData.section" name="section" required>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline">
                <mat-label>Room Number</mat-label>
                <input matInput [(ngModel)]="formData.roomNumber" name="roomNumber">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Academic Year</mat-label>
                <mat-select [(value)]="formData.academicYear" required>
                  <mat-option value="2025-2026">2025-2026</mat-option>
                  <mat-option value="2026-2027">2026-2027</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="dialog-actions">
                <button mat-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit">
                  {{ editingClass() ? 'Update' : 'Add' }} Class
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .page-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }
    .page-header button { display: flex; align-items: center; gap: 8px; }

    .table-card { border-radius: 12px; }
    table { width: 100%; }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: var(--surface);
      border-radius: 16px;
      width: 100%;
      max-width: 480px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }

    .dialog-header h2 { font-size: 20px; font-weight: 600; margin: 0; color: var(--text-primary); }

    .class-form { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    mat-form-field { width: 100%; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      .page-header button { width: 100%; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ClassesComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['name', 'grade', 'section', 'academicYear', 'students', 'room', 'actions'];
  dataSource = new MatTableDataSource<any>();
  
  showDialog = signal(false);
  editingClass = signal<any>(null);
  grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  formData: any = this.getEmptyForm();

  constructor(private dataService: DataService) {}

  ngAfterViewInit() {
    this.dataSource.data = this.dataService.classes();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddDialog() {
    this.editingClass.set(null);
    this.formData = this.getEmptyForm();
    this.showDialog.set(true);
  }

  editClass(cls: any) {
    this.editingClass.set(cls);
    this.formData = { ...cls };
    this.showDialog.set(true);
  }

  deleteClass(cls: any) {
    if (confirm(`Delete class ${cls.name}?`)) {
      this.dataService.deleteClass(cls.id);
      this.dataSource.data = this.dataService.classes();
    }
  }

  saveClass() {
    const name = `Class ${this.formData.grade}-${this.formData.section}`;
    if (this.editingClass()) {
      this.dataService.updateClass(this.editingClass().id, { ...this.formData, name });
    } else {
      this.dataService.addClass({
        ...this.formData,
        name,
        studentIds: [],
        classTeacherId: ''
      });
    }
    this.dataSource.data = this.dataService.classes();
    this.closeDialog();
  }

  closeDialog() {
    this.showDialog.set(false);
    this.editingClass.set(null);
    this.formData = this.getEmptyForm();
  }

  getEmptyForm() {
    return {
      grade: null,
      section: '',
      roomNumber: '',
      academicYear: '2025-2026'
    };
  }
}