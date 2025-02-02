import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

// const AUTH_API = 'https://charitybackend.onrender.com/api/auth/';
const AUTH_API = 'http://localhost/api/api/auth/';

interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string): Observable<AuthResponse> {
    console.log('Login request:', { username }); // Debug log
    return this.http.post<AuthResponse>(AUTH_API + 'login', {
      username,
      password
    }).pipe(
      tap(response => {
        console.log('Login response received:', response); // Debug log
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
      }),
      catchError(this.handleError)
    );
  }

  saveUser(username: string, email: string, password: string, role: string = 'ROLE_USER'): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    return this.http.post(AUTH_API + 'register', {
      username,
      email,
      password,
      role
    }, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${AUTH_API}users`).pipe(
      tap(users => console.log('Fetched users:', users)), // Debug log
      catchError(this.handleError)
    );
  }

  updateUser(id: number, userDetails: User): Observable<string> {
    return this.http.put(`${AUTH_API}users/${id}`, {
      username: userDetails.username,
      email: userDetails.email,
      password: userDetails.password,
      role: userDetails.role
    }, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${AUTH_API}users/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decode the JWT token
      const tokenData = JSON.parse(atob(token.split('.')[1]));

      // Check if token has expired
      const expirationDate = new Date(tokenData.exp * 1000);
      const now = new Date();

      if (now > expirationDate) {
        this.logout(); // Token expired, clear storage and redirect
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  hasAdminRole(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;

    try {
      const userData = JSON.parse(user) as AuthResponse;
      const isAdminRole = userData.role === 'ROLE_ADMIN' || userData.role === 'ADMIN';
      const hasAdminInRoles = Array.isArray(userData.roles) &&
        (userData.roles.includes('ROLE_ADMIN') || userData.roles.includes('ADMIN'));

      return isAdminRole || hasAdminInRoles;
    } catch {
      return false;
    }
  }

  hasUserRole(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;

    try {
      const userData = JSON.parse(user) as AuthResponse;
      const isUserRole = userData.role === 'ROLE_USER' || userData.role === 'USER';
      const hasUserInRoles = Array.isArray(userData.roles) &&
        (userData.roles.includes('ROLE_USER') || userData.roles.includes('USER'));

      return isUserRole || hasUserInRoles;
    } catch {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error); // Debug log
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }
    return throwError(() => error);
  }
}
