import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, LoginCredentials, AuthState, Student, Teacher, Parent, Admin } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'educore_auth';
  
  private authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly userRole = computed(() => this.authState().user?.role);

  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@educore.com',
      password: 'admin123',
      firstName: 'John',
      lastName: 'Admin',
      role: 'admin',
      phone: '555-0100',
      address: '123 School St',
      createdAt: new Date()
    } as Admin,
    {
      id: '2',
      email: 'teacher@educore.com',
      password: 'teacher123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'teacher',
      phone: '555-0101',
      address: '456 Teacher Ave',
      createdAt: new Date()
    } as Teacher,
    {
      id: '3',
      email: 'student@educore.com',
      password: 'student123',
      firstName: 'Michael',
      lastName: 'Smith',
      role: 'student',
      phone: '555-0102',
      address: '789 Student Rd',
      createdAt: new Date()
    } as Student,
    {
      id: '4',
      email: 'parent@educore.com',
      password: 'parent123',
      firstName: 'Emily',
      lastName: 'Parent',
      role: 'parent',
      phone: '555-0103',
      address: '321 Family Ln',
      createdAt: new Date()
    } as Parent
  ];

  constructor(private router: Router) {
    this.loadAuthFromStorage();
  }

  login(credentials: LoginCredentials): { success: boolean; error?: string } {
    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = this.generateToken(user.id, user.role);
    const state: AuthState = {
      user,
      token,
      isAuthenticated: true
    };

    this.authState.set(state);
    this.saveAuthToStorage(state);
    this.redirectByRole(user.role);

    return { success: true };
  }

  logout(): void {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  getRole(): UserRole | null {
    return this.authState().user?.role || null;
  }

  hasRole(roles: UserRole[]): boolean {
    const role = this.authState().user?.role;
    return role ? roles.includes(role) : false;
  }

  private redirectByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      admin: '/dashboard',
      teacher: '/dashboard',
      student: '/dashboard',
      parent: '/dashboard'
    };
    this.router.navigate([routes[role]]);
  }

  private generateToken(userId: string, role: string): string {
    return btoa(`${userId}:${role}:${Date.now()}`);
  }

  private saveAuthToStorage(state: AuthState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  private loadAuthFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const state = JSON.parse(stored) as AuthState;
        if (state.isAuthenticated && state.user) {
          this.authState.set(state);
        }
      } catch {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }
}