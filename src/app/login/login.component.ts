import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
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
    // Check if already logged in and redirect accordingly
    if (this.authService.isLoggedIn()) {
      if (this.authService.hasAdminRole()) {
        this.router.navigate(['/dashboard']);
      } else if (this.authService.hasUserRole()) {
        this.router.navigate(['/orphans']);
      }
    }
  }

  containerClick() {
    // This method is needed to trigger the hover effect on mobile devices
    // The CSS handles the animation
  }

  onSubmit(): void {
    console.log('Form submitted', this.loginForm.value); // Debug log
    
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      const { username, password } = this.loginForm.value;

      console.log('Attempting login with username:', username); // Debug log

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Debug log

          if (response && response.token) {
            // Store the token and user data
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response));

            // Get user roles
            const userRoles = response.roles || [response.role];
            console.log('User roles:', userRoles); // Debug log
            
            // Redirect based on role
            if (userRoles.includes('ROLE_ADMIN')) {
              console.log('Redirecting to dashboard'); // Debug log
              this.router.navigate(['/dashboard']).then(() => {
                console.log('Navigation to dashboard complete'); // Debug log
              });
            } else if (userRoles.includes('ROLE_USER')) {
              console.log('Redirecting to orphans'); // Debug log
              this.router.navigate(['/orphans']).then(() => {
                console.log('Navigation to orphans complete'); // Debug log
              });
            } else {
              console.log('Invalid role:', userRoles); // Debug log
              this.error = 'Invalid role assignment';
              this.authService.logout();
            }
          } else {
            console.log('Invalid response:', response); // Debug log
            this.error = 'Invalid response from server';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Login error:', err); // Debug log
          if (err.status === 401) {
            this.error = 'Invalid username or password';
          } else if (err.status === 403) {
            this.error = 'Access denied';
          } else {
            this.error = err.error || 'An error occurred. Please try again later.';
          }
          this.loading = false;
        }
      });
    } else {
      console.log('Form invalid:', this.loginForm.errors); // Debug log
      this.error = 'Please fill in all required fields';
    }
  }
}
