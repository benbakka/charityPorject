import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BidiModule } from '@angular/cdk/bidi';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    BidiModule
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Register</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="fill">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required minlength="3">
              <mat-error *ngIf="registerForm.form.get('username')?.errors?.['required']">Username is required</mat-error>
              <mat-error *ngIf="registerForm.form.get('username')?.errors?.['minlength']">Username must be at least 3 characters</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required email>
              <mat-error *ngIf="registerForm.form.get('email')?.errors?.['required']">Email is required</mat-error>
              <mat-error *ngIf="registerForm.form.get('email')?.errors?.['email']">Please enter a valid email</mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required minlength="6">
              <mat-error *ngIf="registerForm.form.get('password')?.errors?.['required']">Password is required</mat-error>
              <mat-error *ngIf="registerForm.form.get('password')?.errors?.['minlength']">Password must be at least 6 characters</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.form.valid">
              Register
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    mat-card {
      max-width: 400px;
      width: 90%;
      padding: 20px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    mat-form-field {
      width: 100%;
    }
    button {
      width: 100%;
    }
  `]
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password) {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000
      });
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.error) {
          errorMessage = typeof error.error === 'string' ? error.error : error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000
        });
      }
    });
  }
}
