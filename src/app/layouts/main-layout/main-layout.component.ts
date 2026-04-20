import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { DataService } from '../../core/services/data.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OverlayModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <div class="app-container" [class.sidebar-collapsed]="sidebarCollapsed()">
      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <div class="sidebar-header">
<div class="logo">
          <svg viewBox="0 0 48 48" fill="none" class="logo-icon">
            <defs>
              <linearGradient id="logoGradSide" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2563EB"/>
                <stop offset="100%" stop-color="#1D4ED8"/>
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="url(#logoGradSide)"/>
            <path d="M14 32V16L24 10L34 16V32L24 38L14 32Z" stroke="white" stroke-width="2.5" fill="none"/>
            <path d="M24 20V32M17 26H31" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="24" cy="24" r="3" fill="white"/>
          </svg>
          @if (!sidebarCollapsed()) {
            <span class="logo-text">SmartSchool</span>
          }
        </div>
          <button mat-icon-button class="collapse-btn" (click)="toggleSidebar()">
            <mat-icon>{{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
        </div>

        <nav class="sidebar-nav">
          @for (item of visibleNavItems(); track item.route) {
            <a 
              [routerLink]="item.route" 
              routerLinkActive="active"
              class="nav-item"
              [matTooltip]="sidebarCollapsed() ? item.label : ''"
              matTooltipPosition="right"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              @if (!sidebarCollapsed()) {
                <span>{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <mat-divider></mat-divider>
          <a routerLink="/auth/logout" class="nav-item logout" (click)="logout()" matTooltip="Logout" matTooltipPosition="right">
            <mat-icon>logout</mat-icon>
            @if (!sidebarCollapsed()) {
              <span>Logout</span>
            }
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <button mat-icon-button class="menu-btn" (click)="toggleSidebar()">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="search-box" [class.expanded]="searchExpanded()">
              <mat-icon>search</mat-icon>
              <input 
                type="text" 
                placeholder="Search students, teachers, classes..." 
                [(ngModel)]="searchQuery"
                (focus)="searchExpanded.set(true)"
                (blur)="onSearchBlur()"
              >
            </div>
          </div>

          <div class="header-right">
            <button mat-icon-button class="theme-toggle" (click)="toggleTheme()" [matTooltip]="isDark() ? 'Light mode' : 'Dark mode'">
              <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>

            <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn">
              <mat-icon [matBadge]="unreadNotifications()" matBadgeColor="warn" [matBadgeHidden]="unreadNotifications() === 0">notifications</mat-icon>
            </button>
            <mat-menu #notificationMenu="matMenu" class="notification-menu">
              <div class="notification-header">
                <span>Notifications</span>
                <button mat-button color="primary">Mark all read</button>
              </div>
              <mat-divider></mat-divider>
              @for (notif of notifications(); track notif.id) {
                <button mat-menu-item class="notification-item" [class.unread]="!notif.isRead">
                  <mat-icon [class]="notif.type">{{ getNotificationIcon(notif.type) }}</mat-icon>
                  <div class="notification-content">
                    <span class="title">{{ notif.title }}</span>
                    <span class="message">{{ notif.message }}</span>
                  </div>
                </button>
              }
              @if (notifications().length === 0) {
                <div class="no-notifications">No notifications</div>
              }
            </mat-menu>

            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <div class="user-avatar">
                {{ userInitials() }}
              </div>
            </button>
            <mat-menu #userMenu="matMenu">
              <div class="user-info">
                <div class="user-name">{{ userName() }}</div>
                <div class="user-role">{{ userRole() | titlecase }}</div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item>
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item>
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: var(--background);
    }

    .sidebar {
      width: 260px;
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 72px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
    }

    .collapse-btn {
      opacity: 0.7;
    }

    .sidebar.collapsed .collapse-btn {
      display: none;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 4px;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .nav-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--primary);
      color: white;
    }

    .nav-item mat-icon {
      flex-shrink: 0;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 12px;
    }

    .sidebar.collapsed .nav-item span {
      display: none;
    }

    .sidebar-footer {
      padding: 8px;
    }

    .logout {
      color: var(--error);
    }

    .logout:hover {
      background: #FEF2F2;
      color: var(--error);
    }

    .main-wrapper {
      flex: 1;
      margin-left: 260px;
      transition: margin-left 0.3s ease;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .sidebar-collapsed .main-wrapper {
      margin-left: 72px;
    }

    .header {
      height: 64px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-btn {
      display: none;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
      width: 300px;
      transition: all 0.2s ease;
    }

    .search-box.expanded {
      width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .search-box mat-icon {
      color: var(--text-secondary);
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: var(--text-primary);
      width: 100%;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .theme-toggle, .notification-btn {
      color: var(--text-secondary);
    }

    .user-btn {
      padding: 0;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      padding: 24px;
    }

    .notification-menu {
      width: 360px;
      max-height: 400px;
    }

    .notification-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      font-weight: 600;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      white-space: normal;
      height: auto;
    }

    .notification-item.unread {
      background: var(--primary-light);
    }

    .notification-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .notification-content .title {
      font-weight: 500;
      color: var(--text-primary);
    }

    .notification-content .message {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .no-notifications {
      padding: 24px;
      text-align: center;
      color: var(--text-secondary);
    }

    .user-info {
      padding: 16px;
    }

    .user-name {
      font-weight: 600;
      font-size: 16px;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 14px;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.collapsed {
        transform: translateX(0);
        width: 260px;
      }

      .main-wrapper {
        margin-left: 0;
      }

      .sidebar-collapsed .main-wrapper {
        margin-left: 0;
      }

      .menu-btn {
        display: flex;
      }

      .search-box {
        display: none;
      }
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
  searchExpanded = signal(false);
  searchQuery = '';

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', roles: ['admin', 'teacher', 'student', 'parent'] },
    { label: 'Students', icon: 'school', route: '/students', roles: ['admin', 'teacher'] },
    { label: 'Teachers', icon: 'person', route: '/teachers', roles: ['admin'] },
    { label: 'Classes', icon: 'class', route: '/classes', roles: ['admin', 'teacher'] },
    { label: 'Attendance', icon: 'fact_check', route: '/attendance', roles: ['admin', 'teacher'] },
    { label: 'Grades', icon: 'grade', route: '/grades', roles: ['admin', 'teacher', 'student', 'parent'] },
    { label: 'Timetable', icon: 'schedule', route: '/timetable', roles: ['admin', 'teacher', 'student', 'parent'] },
    { label: 'Announcements', icon: 'campaign', route: '/announcements', roles: ['admin', 'teacher', 'student', 'parent'] },
    { label: 'Settings', icon: 'settings', route: '/settings', roles: ['admin'] }
  ];

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private dataService: DataService
  ) {}

  visibleNavItems = computed(() => {
    const role = this.authService.getRole();
    if (!role) return [];
    return this.navItems.filter(item => item.roles.includes(role));
  });

  isDark = computed(() => this.themeService.isDark());

  userName = computed(() => {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  });

  userRole = computed(() => this.authService.getRole());

  userInitials = computed(() => {
    const user = this.authService.user();
    if (!user) return 'U';
    return `${user.firstName[0]}${user.lastName[0]}`;
  });

  notifications = computed(() => this.dataService.notifications().slice(0, 5));

  unreadNotifications = computed(() => 
    this.dataService.notifications().filter(n => !n.isRead).length
  );

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  onSearchBlur() {
    if (!this.searchQuery) {
      this.searchExpanded.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      announcement: 'campaign',
      grade: 'grade',
      attendance: 'fact_check',
      assignment: 'assignment',
      reminder: 'notifications',
      alert: 'warning'
    };
    return icons[type] || 'notifications';
  }
}