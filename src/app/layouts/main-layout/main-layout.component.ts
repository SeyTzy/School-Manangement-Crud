import { Component, signal, computed, HostListener } from '@angular/core';
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
    <div class="app-container" [class.sidebar-open]="sidebarOpen()" [class.sidebar-collapsed]="sidebarCollapsed() && !isMobile()">
      <!-- Sidebar Overlay (mobile) -->
      @if (sidebarOpen() && isMobile()) {
        <div class="sidebar-overlay" (click)="closeSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()" [class.collapsed]="sidebarCollapsed() && !isMobile()">
        <div class="sidebar-header">
          <div class="logo">
            <img src="/image/setec-logo.png" alt="Setec Logo" class="logo-img">
          </div>
          @if (!isMobile()) {
            <button mat-icon-button class="collapse-btn" (click)="toggleCollapse()">
              <mat-icon>{{ sidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
            </button>
          } @else {
            <button mat-icon-button class="collapse-btn" (click)="closeSidebar()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>

        <nav class="sidebar-nav">
          @for (item of visibleNavItems(); track item.route) {
            <a 
              [routerLink]="item.route" 
              routerLinkActive="active"
              class="nav-item"
              [matTooltip]="(sidebarCollapsed() && !isMobile()) ? item.label : ''"
              matTooltipPosition="right"
              (click)="onNavClick()"
            >
              <mat-icon>{{ item.icon }}</mat-icon>
              @if (!sidebarCollapsed() || isMobile()) {
                <span>{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <mat-divider></mat-divider>
          <button class="nav-item logout" (click)="logout()" [matTooltip]="(sidebarCollapsed() && !isMobile()) ? 'Logout' : ''" matTooltipPosition="right">
            <mat-icon>logout</mat-icon>
            @if (!sidebarCollapsed() || isMobile()) {
              <span>Logout</span>
            }
          </button>
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
              <mat-icon class="search-icon">search</mat-icon>
              <input 
                type="text" 
                placeholder="Search..." 
                [(ngModel)]="searchQuery"
                (focus)="searchExpanded.set(true)"
                (blur)="onSearchBlur()"
              >
            </div>
          </div>

          <div class="header-right">
            <button mat-icon-button class="icon-btn" (click)="toggleTheme()" [matTooltip]="isDark() ? 'Light mode' : 'Dark mode'">
              <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>

            <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="icon-btn">
              <mat-icon [matBadge]="unreadNotifications()" matBadgeColor="warn" [matBadgeHidden]="unreadNotifications() === 0">notifications</mat-icon>
            </button>
            <mat-menu #notificationMenu="matMenu" class="notif-menu" xPosition="before" overlapTrigger="false">
              <div class="notif-header">
                <span class="notif-title">Notifications</span>
                <button mat-button color="primary" class="notif-mark">Mark all read</button>
              </div>
              <mat-divider></mat-divider>
              @for (notif of notifications(); track notif.id) {
                <button mat-menu-item class="notif-item" [class.unread]="!notif.isRead">
                  <mat-icon class="notif-icon" [class]="notif.type">{{ getNotificationIcon(notif.type) }}</mat-icon>
                  <div class="notif-body">
                    <span class="notif-item-title">{{ notif.title }}</span>
                    <span class="notif-msg">{{ notif.message }}</span>
                  </div>
                </button>
              }
              @if (notifications().length === 0) {
                <div class="notif-empty">No notifications</div>
              }
            </mat-menu>

            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <div class="user-avatar">{{ userInitials() }}</div>
            </button>
            <mat-menu #userMenu="matMenu" xPosition="before" overlapTrigger="false">
              <div class="user-card">
                <div class="user-card-avatar">{{ userInitials() }}</div>
                <div class="user-card-info">
                  <div class="user-card-name">{{ userName() }}</div>
                  <div class="user-card-role">{{ userRole() | titlecase }}</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item>
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item routerLink="/settings">
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

    .sidebar-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sidebar {
      width: var(--sidebar-width);
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      height: var(--header-height);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
    }

    .logo-img {
      height: 38px;
      width: auto;
    }

    .collapse-btn {
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .collapse-btn:hover {
      opacity: 1;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 10px;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 2px;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-family: inherit;
    }

    .nav-item:hover {
      background: var(--primary-light);
      color: var(--primary);
    }

    .nav-item.active {
      background: var(--primary);
      color: white;
    }

    .nav-item.mat-icon {
      flex-shrink: 0;
      font-size: 22px;
    }

    .sidebar.collapsed .nav-item {
      justify-content: center;
      padding: 10px;
    }

    .sidebar-footer {
      padding: 8px;
      flex-shrink: 0;
    }

    .logout {
      color: var(--error);
    }

    .logout:hover {
      background: #FEF2F2 !important;
      color: var(--error) !important;
    }

    .main-wrapper {
      flex: 1;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .sidebar-collapsed .main-wrapper {
      margin-left: var(--sidebar-collapsed-width);
    }

    .header {
      height: var(--header-height);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .menu-btn {
      display: none;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 10px;
      width: min(320px, 40vw);
      transition: all 0.25s ease;
    }

    .search-box:focus-within {
      width: min(400px, 50vw);
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .search-icon {
      color: var(--text-secondary);
      font-size: 20px;
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: var(--text-primary);
      width: 100%;
    }

    .search-box input::placeholder {
      color: var(--text-secondary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .icon-btn {
      color: var(--text-secondary);
    }

    .user-btn {
      padding: 0;
      margin-left: 4px;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      padding: 24px;
    }

    .notif-menu {
      width: 360px;
      max-height: 420px;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
    }

    .notif-title {
      font-weight: 600;
      font-size: 15px;
      color: var(--text-primary);
    }

    .notif-mark {
      font-size: 13px;
    }

    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      white-space: normal;
      height: auto;
      line-height: 1.4;
    }

    .notif-item.unread {
      background: var(--primary-light);
    }

    .notif-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: 2px;
    }

    .notif-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .notif-item-title {
      font-weight: 500;
      font-size: 14px;
      color: var(--text-primary);
    }

    .notif-msg {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .notif-empty {
      padding: 32px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }

    .user-card-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 600;
    }

    .user-card-name {
      font-weight: 600;
      font-size: 15px;
      color: var(--text-primary);
    }

    .user-card-role {
      font-size: 13px;
      color: var(--text-secondary);
      text-transform: capitalize;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        width: var(--sidebar-width);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .sidebar.collapsed {
        width: var(--sidebar-width);
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
        width: 40px;
        padding: 8px;
        overflow: hidden;
      }

      .search-box:focus-within {
        width: calc(100vw - 120px);
      }

      .search-box input {
        opacity: 0;
      }

      .search-box:focus-within input {
        opacity: 1;
      }

      .notif-menu {
        width: calc(100vw - 32px);
        max-width: 360px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
  sidebarOpen = signal(false);
  searchExpanded = signal(false);
  searchQuery = '';
  isMobile = signal(window.innerWidth <= 768);

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
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile.set(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      this.sidebarOpen.set(false);
    }
  }

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
    if (this.isMobile()) {
      this.sidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }

  toggleCollapse() {
    this.sidebarCollapsed.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  onNavClick() {
    if (this.isMobile()) {
      this.closeSidebar();
    }
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