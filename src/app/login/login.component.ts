import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if already logged in
    if (this.authService.isLoggedIn() && this.authService.hasAdminRole()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response && response.token) {
            // Store the token first
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response));

            // Then check admin privileges
            if (this.authService.hasAdminRole()) {
              this.router.navigate(['/dashboard']);
            } else {
              this.error = 'Access denied. Admin privileges required.';
              this.authService.logout();
            }
          } else {
            this.error = 'Invalid response from server';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.status === 401) {
            this.error = 'Invalid username or password';
          } else if (err.status === 403) {
            this.error = 'Access denied';
          } else {
            this.error = 'An error occurred. Please try again later.';
          }
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill in all required fields';
    }
  }
}
