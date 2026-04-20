import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-bg">
        <div class="bg-shape shape-1"></div>
        <div class="bg-shape shape-2"></div>
        <div class="bg-shape shape-3"></div>
      </div>
      
      <div class="login-content">
        <div class="login-header">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2563EB"/>
                    <stop offset="100%" stop-color="#1D4ED8"/>
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="22" fill="url(#logoGrad)"/>
                <path d="M14 32V16L24 10L34 16V32L24 38L14 32Z" stroke="white" stroke-width="2.5" fill="none"/>
                <path d="M24 20V32M17 26H31" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <circle cx="24" cy="24" r="3" fill="white"/>
              </svg>
            </div>
            <span class="logo-text">SmartSchool</span>
          </div>
          <h1>{{ isRegisterMode() ? 'Create Account' : 'Welcome back' }}</h1>
          <p>{{ isRegisterMode() ? 'Sign up to get started' : 'Sign in to access your dashboard' }}</p>
        </div>

        @if (isRegisterMode()) {
          <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="login-form">
            @if (errorMessage()) {
              <div class="error-alert">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="Enter first name">
                <mat-icon matPrefix>person</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Enter last name">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role">
                <mat-option value="student">Student</mat-option>
                <mat-option value="teacher">Teacher</mat-option>
                <mat-option value="parent">Parent</mat-option>
              </mat-select>
              <mat-icon matPrefix>badge</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Create a password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="confirmPassword" placeholder="Confirm your password">
              <mat-icon matPrefix>lock_outline</mat-icon>
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit" [disabled]="isLoading()" class="login-btn">
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Create Account
              }
            </button>

            <div class="switch-mode">
              Already have an account? 
              <a href="#" (click)="toggleMode($event)">Sign In</a>
            </div>
          </form>
        } @else {
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            @if (errorMessage()) {
              <div class="error-alert">
                <mat-icon>error_outline</mat-icon>
                {{ errorMessage() }}
              </div>
            }

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter your email">
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="Enter your password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button mat-flat-button color="primary" type="submit" [disabled]="isLoading()" class="login-btn">
              @if (isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Sign In
              }
            </button>

            <div class="switch-mode">
              Don't have an account? 
              <a href="#" (click)="toggleMode($event)">Sign Up</a>
            </div>
          </form>
        }

        @if (!isRegisterMode()) {
          <div class="demo-credentials">
            <h4>Demo Accounts</h4>
            <div class="demo-grid">
              <button type="button" (click)="fillDemo('admin@educore.com', 'admin123')" class="demo-btn admin">
                <mat-icon>admin_panel_settings</mat-icon>
                Admin
              </button>
              <button type="button" (click)="fillDemo('teacher@educore.com', 'teacher123')" class="demo-btn teacher">
                <mat-icon>school</mat-icon>
                Teacher
              </button>
              <button type="button" (click)="fillDemo('student@educore.com', 'student123')" class="demo-btn student">
                <mat-icon>person</mat-icon>
                Student
              </button>
              <button type="button" (click)="fillDemo('parent@educore.com', 'parent123')" class="demo-btn parent">
                <mat-icon>family_restroom</mat-icon>
                Parent
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      position: relative;
      overflow: hidden;
      background: var(--surface);
    }

    .login-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
    }

    .shape-1 {
      width: 400px;
      height: 400px;
      background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
      top: -100px;
      right: -100px;
      animation: float 20s ease-in-out infinite;
    }

    .shape-2 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
      bottom: -50px;
      left: -50px;
      animation: float 15s ease-in-out infinite reverse;
    }

    .shape-3 {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
      top: 50%;
      left: 50%;
      animation: float 18s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(30px, -30px); }
      50% { transform: translate(-20px, 20px); }
      75% { transform: translate(20px, 30px); }
    }

    .login-content {
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo-icon {
      width: 48px;
      height: 48px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
    }

    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .login-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }

    .login-header p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .login-form {
      background: var(--surface);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #FEF2F2;
      border: 1px solid #FECACA;
      border-radius: 8px;
      color: #DC2626;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .error-alert mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 8px;
    }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .forgot-link {
      font-size: 14px;
      color: #2563EB;
      text-decoration: none;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-btn mat-spinner {
      display: inline-block;
    }

    .switch-mode {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .switch-mode a {
      color: #2563EB;
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;
    }

    .switch-mode a:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      margin-top: 24px;
      padding: 20px;
      background: var(--surface);
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .demo-credentials h4 {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 12px 0;
      text-align: center;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .demo-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: transparent;
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .demo-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .demo-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .demo-btn.admin:hover { background: #7C3AED; border-color: #7C3AED; }
    .demo-btn.teacher:hover { background: #059669; border-color: #059669; }
    .demo-btn.student:hover { background: #2563EB; border-color: #2563EB; }
    .demo-btn.parent:hover { background: #D97706; border-color: #D97706; }

    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true);
  isRegisterMode = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['student', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      const result = this.authService.login(this.loginForm.value);
      if (!result.success) {
        this.errorMessage.set(result.error || 'Login failed');
      }
      this.isLoading.set(false);
    }, 800);
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...userData } = this.registerForm.value;
    
    if (this.registerForm.value.password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      alert('Registration successful! Please login.');
      this.isRegisterMode.set(false);
      this.isLoading.set(false);
      this.registerForm.reset({ role: 'student' });
    }, 800);
  }

  toggleMode(event: Event) {
    event.preventDefault();
    this.isRegisterMode.update(v => !v);
    this.errorMessage.set('');
  }

  fillDemo(email: string, password: string) {
    this.loginForm.patchValue({ email, password });
  }
}