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
  // eslint-disable-next-line max-len
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
            <img src="/image/setec-logo.png" alt="Setec Logo" class="logo-img">
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
              <button type="button" (click)="fillDemo('admin@gmail.com', 'admin123')" class="demo-btn admin">
                <mat-icon>admin_panel_settings</mat-icon>
                Admin
              </button>
              <button type="button" (click)="fillDemo('teacher@gmail.com', 'teacher123')" class="demo-btn teacher">
                <mat-icon>school</mat-icon>
                Teacher
              </button>
              <button type="button" (click)="fillDemo('student@gmail.com', 'student123')" class="demo-btn student">
                <mat-icon>person</mat-icon>
                Student
              </button>
              <button type="button" (click)="fillDemo('parent@gmail.com', 'parent123')" class="demo-btn parent">
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
      padding: 16px;
      position: relative;
      overflow: hidden;
      background: var(--surface);
    }

    .login-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      // background-image: url('/image/bg-logo.png');
      background-repeat: no-repeat;
      background-position: top 20px left 20px;
      background-size: auto;
    }

    .bg-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }

    .shape-1 {
      width: min(400px, 50vw);
      height: min(400px, 50vw);
      background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
      top: -10%;
      right: -10%;
      animation: float 20s ease-in-out infinite;
    }

    .shape-2 {
      width: min(300px, 40vw);
      height: min(300px, 40vw);
      background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%);
      bottom: -8%;
      left: -8%;
      animation: float 15s ease-in-out infinite reverse;
    }

    .shape-3 {
      width: min(200px, 30vw);
      height: min(200px, 30vw);
      background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
      top: 50%;
      left: 60%;
      animation: float 18s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(40px, -40px) rotate(5deg); }
      50% { transform: translate(-20px, 20px) rotate(-3deg); }
      75% { transform: translate(30px, 40px) rotate(4deg); }
    }

    .login-content {
      width: 100%;
      max-width: 420px;
      position: relative;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .logo-img {
      height: 48px;
      width: auto;
    }

    .login-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 6px;
    }

    .login-header p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .login-form {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 28px;
      box-shadow: var(--shadow-lg);
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
      border-radius: var(--radius-md);
      color: #DC2626;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .error-alert mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 4px;
    }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .forgot-link {
      font-size: 14px;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .login-btn {
      width: 100%;
      height: 46px;
      font-size: 15px;
      font-weight: 600;
      border-radius: var(--radius-md);
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
      color: var(--primary);
      font-weight: 600;
      text-decoration: none;
      margin-left: 4px;
    }

    .switch-mode a:hover {
      text-decoration: underline;
    }

    .demo-credentials {
      margin-top: 20px;
      padding: 16px 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }

    .demo-credentials h4 {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin: 0 0 12px;
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
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .demo-btn:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .demo-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .demo-btn.admin:hover { background: #7C3AED; border-color: #7C3AED; }
    .demo-btn.teacher:hover { background: #059669; border-color: #059669; }
    .demo-btn.student:hover { background: #2563EB; border-color: #2563EB; }
    .demo-btn.parent:hover { background: #D97706; border-color: #D97706; }

    @media (max-width: 480px) {
      .login-container { padding: 12px; }
      .login-content { max-width: 100%; }
      .login-form { padding: 20px; }
      .form-row { grid-template-columns: 1fr; }
      .demo-grid { grid-template-columns: 1fr; }
      .login-header h1 { font-size: 22px; }
      .logo-img { height: 40px; }
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