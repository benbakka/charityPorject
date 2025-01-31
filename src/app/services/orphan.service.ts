import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OrphanIDCard } from '../models/orphan-idcard';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class OrphanService {

  // private apiUrl = 'https://charitybackend.onrender.com/api/orphans';
  private apiUrl = 'http://localhost:8080/api/orphans';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getOrphans(): Observable<OrphanIDCard[]> {
    return this.http.get<OrphanIDCard[]>(this.apiUrl).pipe(
      map(orphans => {
        return orphans.map(orphan => {
          if (orphan.photo) {
            // Create a URL that includes the auth token
            const token = localStorage.getItem('auth_token');
            // orphan.photo = `https://charitybackend.onrender.com${orphan.photo}`;
            orphan.photo = `http://localhost:8080${orphan.photo}`;
            // Create blob URL for the image
            this.http.get(orphan.photo, {
              headers: this.getAuthHeaders(),
              responseType: 'blob'
            }).subscribe(blob => {
              const objectUrl = URL.createObjectURL(blob);
              orphan.photo = objectUrl;
            });
          }
          return orphan;
        });
      })
    );
  }

  getLastOrphanId(country: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/last-orphan-id/${country}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  addOrphanWithPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData, { headers: this.getAuthHeaders() });
  }

  updateOrphanWithPhoto(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers: this.getAuthHeaders() });
  }

  deleteOrphan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deleteAllOrphans(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
