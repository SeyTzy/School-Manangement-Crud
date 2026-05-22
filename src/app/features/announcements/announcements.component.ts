import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Latest news and updates from the school</p>
        </div>
      </div>

      <div class="announcements-grid">
        @for (announcement of announcements(); track announcement.id) {
          <mat-card class="announcement-card" [class]="announcement.priority">
            <mat-card-header>
              <mat-icon mat-card-avatar [class]="announcement.priority">
                {{ getIcon(announcement.priority) }}
              </mat-icon>
              <mat-card-title>{{ announcement.title }}</mat-card-title>
              <mat-card-subtitle>
                {{ announcement.createdAt | date:'medium' }}
                <mat-chip [class]="announcement.priority">{{ announcement.priority }}</mat-chip>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ announcement.message }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button>
                <mat-icon>share</mat-icon>
                Share
              </button>
              <button mat-button>
                <mat-icon>bookmark</mat-icon>
                Save
              </button>
            </mat-card-actions>
          </mat-card>
        }
      </div>

      @if (announcements().length === 0) {
        <div class="empty-state">
          <mat-icon>campaign</mat-icon>
          <p>No announcements yet</p>
        </div>
      }
    </div>
  `,
  styles: [`
:host { display: block; }

.announcements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.announcement-card {
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary) !important;
}

.announcement-card.high { border-left-color: #EF4444 !important; }
.announcement-card.normal { border-left-color: #2563EB !important; }
.announcement-card.low { border-left-color: #10B981 !important; }

.announcement-card mat-icon[mat-card-avatar] {
  width: 48px;
  height: 48px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
}

.announcement-card mat-icon.high { background: #FEF2F2; color: #EF4444; }
.announcement-card mat-icon.normal { background: #EFF6FF; color: #2563EB; }
.announcement-card mat-icon.low { background: #ECFDF5; color: #10B981; }

.announcement-card mat-chip {
  font-size: 11px;
  min-height: 24px;
  padding: 0 8px;
}

.announcement-card mat-chip.high { background: #FEF2F2; color: #EF4444; }
.announcement-card mat-chip.normal { background: #EFF6FF; color: #2563EB; }
.announcement-card mat-chip.low { background: #ECFDF5; color: #10B981; }

.announcement-card mat-card-content p {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 14px;
}

@media (max-width: 768px) {
  .announcements-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class AnnouncementsComponent {
  constructor(private dataService: DataService) {}

  announcements = computed(() => this.dataService.announcements());

  getIcon(priority: string): string {
    if (priority === 'high') return 'error';
    if (priority === 'low') return 'info';
    return 'campaign';
  }
}