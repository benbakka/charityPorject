import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8080/api/auth/';

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
    return this.http.post<AuthResponse>(AUTH_API + 'login', {
      username,
      password
    }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    return this.http.post(AUTH_API + 'register', {
      username,
      email,
      password
    }, { headers, responseType: 'text' });
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
}
