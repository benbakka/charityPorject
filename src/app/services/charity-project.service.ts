import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharityProject } from '../models/charity-project';

@Injectable({
  providedIn: 'root'
})
export class CharityProjectService {
  // private apiUrl = 'https://charitybackend.onrender.com/api/charity-projects';
  private apiUrl = 'http://localhost:8080/api/charity-projects';

  constructor(private http: HttpClient) { }

  getAllCharityProjects(): Observable<CharityProject[]> {
    return this.http.get<CharityProject[]>(this.apiUrl);
  }

  getCharityProjectById(id: number): Observable<CharityProject> {
    return this.http.get<CharityProject>(`${this.apiUrl}/${id}`);
  }

  createCharityProject(project: CharityProject): Observable<CharityProject> {
    return this.http.post<CharityProject>(this.apiUrl, project);
  }

  updateCharityProject(id: number, project: CharityProject): Observable<CharityProject> {
    return this.http.put<CharityProject>(`${this.apiUrl}/${id}`, project);
  }

  deleteCharityProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteAllCharityProjects(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all`);
  }
  
  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
