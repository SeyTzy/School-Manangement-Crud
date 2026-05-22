import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Settings</h1>
        <p>Manage system preferences</p>
      </div>

      <div class="settings-grid">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>palette</mat-icon>
            <mat-card-title>Appearance</mat-card-title>
            <mat-card-subtitle>Customize how the app looks</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <span class="label">Dark Mode</span>
                <span class="description">Enable dark theme for better night viewing</span>
              </div>
              <mat-slide-toggle (change)="toggleTheme()" [checked]="isDark()"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Notifications</mat-card-title>
            <mat-card-subtitle>Configure notification preferences</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <span class="label">Email Notifications</span>
                <span class="description">Receive updates via email</span>
              </div>
              <mat-slide-toggle checked></mat-slide-toggle>
            </div>
            <div class="setting-item">
              <div class="setting-info">
                <span class="label">Push Notifications</span>
                <span class="description">Receive browser notifications</span>
              </div>
              <mat-slide-toggle></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>security</mat-icon>
            <mat-card-title>Privacy & Security</mat-card-title>
            <mat-card-subtitle>Manage your security settings</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="settings-actions">
              <button mat-stroked-button color="primary">
                <mat-icon>lock</mat-icon>
                Change Password
              </button>
              <button mat-stroked-button color="primary">
                <mat-icon>devices</mat-icon>
                Manage Sessions
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
:host { display: block; }

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.settings-card {
  border-radius: var(--radius-lg);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  gap: 16px;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.setting-info .label {
  font-weight: 500;
  color: var(--text-primary);
}

.setting-info .description {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.settings-actions button {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-actions {
    flex-direction: column;
  }

  .settings-actions button {
    width: 100%;
  }
}
  `]
})
export class SettingsComponent {
  constructor(private themeService: ThemeService) {}

  isDark() {
    return this.themeService.isDark();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}