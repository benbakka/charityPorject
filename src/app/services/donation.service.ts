import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Donation, DonationDTO } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  // private apiUrl = 'https://charitybackend.onrender.com/api/donations';
  private apiUrl = 'http://localhost:8080/api/donations';

  constructor(private http: HttpClient) { }

  // Helper method to include Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Convert DTO to Donation
  private convertDTOToDonation(dto: DonationDTO): Donation {
    return {
      ...dto,
      dateDonation: new Date(dto.dateDonation)
    };
  }

  // Convert Donation to DTO
  private convertDonationToDTO(donation: Donation): DonationDTO {
    // Ensure we're working with a Date object
    const date = new Date(donation.dateDonation);
    // Set the time to midnight UTC to avoid timezone issues
    date.setUTCHours(0, 0, 0, 0);
    
    return {
      ...donation,
      dateDonation: date.toISOString()
    };
  }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<DonationDTO[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        map(dtos => dtos.map(dto => this.convertDTOToDonation(dto)))
      );
  }

  getDonationById(id: number): Observable<Donation> {
    return this.http.get<DonationDTO>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(dto => this.convertDTOToDonation(dto))
      );
  }

  createDonation(donation: Donation): Observable<Donation> {
    const dto = this.convertDonationToDTO(donation);
    console.log('Creating donation with date:', dto.dateDonation);
    return this.http.post<DonationDTO>(this.apiUrl, dto, { headers: this.getAuthHeaders() })
      .pipe(
        map(responseDto => this.convertDTOToDonation(responseDto))
      );
  }

  updateDonation(id: number, donation: Donation): Observable<Donation> {
    const dto = this.convertDonationToDTO(donation);
    console.log('Updating donation with date:', dto.dateDonation);
    return this.http.put<DonationDTO>(`${this.apiUrl}/${id}`, dto, { headers: this.getAuthHeaders() })
      .pipe(
        map(responseDto => this.convertDTOToDonation(responseDto))
      );
  }

  deleteDonation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deleteAllDonations(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getDonationsByDonorId(donorId: number): Observable<DonationDTO[]> {
    const headers = this.getAuthHeaders();
    // Use the donors API endpoint instead of donations
    const url = this.apiUrl.replace('donations', 'donors');
    return this.http.get<DonationDTO[]>(`${url}/${donorId}/donations`, { headers });
  }
}
