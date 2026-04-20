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
            <button mat-stroked-button color="primary">
              <mat-icon>lock</mat-icon>
              Change Password
            </button>
            <button mat-stroked-button color="primary">
              <mat-icon>devices</mat-icon>
              Manage Sessions
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; }
    .page-header p { font-size: 14px; color: var(--text-secondary); margin: 0; }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .settings-card { border-radius: 12px; }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--border);
    }

    .setting-item:last-child { border-bottom: none; }

    .setting-info { display: flex; flex-direction: column; }
    .setting-info .label { font-weight: 500; color: var(--text-primary); }
    .setting-info .description { font-size: 13px; color: var(--text-secondary); }

    .settings-card button { margin-right: 12px; margin-top: 16px; }

    @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
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