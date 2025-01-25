import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donor } from '../models/donor';

@Injectable({
  providedIn: 'root'
})
export class DonorService {
  // private baseUrl = 'https://charitybackend.onrender.com/api/donors';
  private baseUrl = 'https://charitybackend.onrender.com/api/donors';

  constructor(private http: HttpClient) {}

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
  
  // Helper method to include Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Fetch all donors
  getDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  // Fetch a donor by ID
  getDonorById(id: number): Observable<Donor> {
    return this.http.get<Donor>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Create a new donor
  createDonor(donor: Donor): Observable<Donor> {
    return this.http.post<Donor>(this.baseUrl, donor, { headers: this.getAuthHeaders() });
  }

  // Update an existing donor
  updateDonor(id: number, donor: Donor): Observable<Donor> {
    return this.http.put<Donor>(`${this.baseUrl}/${id}`, donor, { headers: this.getAuthHeaders() });
  }

  // Delete a donor by ID
  deleteDonor(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Fetch the last donor ID
  getLastDonorId(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/lastId`, { headers: this.getAuthHeaders() });
  }

  // Delete all donors
  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }
}
