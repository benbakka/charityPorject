import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Permission, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUserPermissions(userId: number): Observable<Permission[]> {
    console.log('Getting permissions for user:', userId);
    return this.http.get<Permission[]>(`${this.apiUrl}/users/${userId}/permissions`).pipe(
      tap(permissions => {
        // Ensure routes start with /
        permissions.forEach(p => {
          if (!p.route.startsWith('/')) {
            p.route = '/' + p.route;
          }
        });
        console.log('Received permissions:', permissions);
      }),
      catchError(this.handleError)
    );
  }

  updateUserPermissions(userId: number, permissions: Permission[]): Observable<void> {
    // Ensure routes start with /
    permissions.forEach(p => {
      if (!p.route.startsWith('/')) {
        p.route = '/' + p.route;
      }
    });
    
    console.log('Updating permissions for user:', userId, 'with:', permissions);
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/permissions`, permissions).pipe(
      tap(() => console.log('Successfully updated permissions')),
      catchError(this.handleError)
    );
  }

  getAvailableRoutes(): Observable<string[]> {
    // Define available routes that can be assigned permissions
    const routes = [
      '/dashboard',
      '/orphans',
      '/OrphanCards',
      '/donors',
      '/charity-projects',
      '/upload',
      '/upload-donors',
      '/upload-donations',
      '/upload-charity-projects'
    ];
    return of(routes);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.error?.message || error.statusText}`;
    }
    
    console.error('Permission service error:', errorMessage);
    return throwError(() => errorMessage);
  }
}
