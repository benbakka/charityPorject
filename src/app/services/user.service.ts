// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable } from 'rxjs';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   // private apiUrl = 'https://charitybackend.onrender.com/api/users';
//   private apiUrl = 'https://charitybackend.onrender.com/api/users';

//   constructor(private http: HttpClient) {}

//   uploadExcel(file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('file', file);
//     return this.http.post(`${this.apiUrl}/upload`, formData);
//   }

//   getUsers(): Observable<User[]> {
//     return this.http.get<User[]>(this.apiUrl).pipe(
//       map(users => {
//         users.forEach(user => {
//           // Assuming the image is relative, add base URL if necessary
//           if (user.photo && !user.photo.startsWith('http')) {
//             user.photo = `https://charitybackend.onrender.com${user.photo}`;
//           }
//         });
//         return users;
//       })
//     );
//   }
  
//   getLastUserId(country: string): Observable<string> {
//     return this.http.get(`${this.apiUrl}/last-user-id/${country}`, {
//       responseType: 'text' // Expect plain text
//     });
//   }
  

//   updateUserWithPhoto(userId: number, formData: FormData): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${userId}`, formData); // No need to manually set Content-Type here
//     console.log(formData);

//   }
  
//   deleteUser(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }

//   addUserWithPhoto(formData: FormData): Observable<any> {
//     return this.http.post(this.apiUrl, formData);
//   }

//   uploadPhoto(file: File): Observable<{ url: string }> {
//     const formData = new FormData();
//     formData.append('photo', file);
//     return this.http.post<{ url: string }>(`${this.apiUrl}/upload-photo`, formData);
//   }

//   downloadUserCard(id: number): Observable<Blob> {
//     return this.http.get(`${this.apiUrl}/${id}/card`, { responseType: 'blob' });
//   }

//   getProxiedImage(imageUrl: string): Observable<any> {
//     return this.http.post('https://charitybackend.onrender.com/api/proxy/image', { url: imageUrl });
//   }
// }