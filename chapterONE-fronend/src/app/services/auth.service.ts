import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveUserData(userData: any) {
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('email', userData.email);
    if (userData.profilePicture) {
      localStorage.setItem('profilePicture', userData.profilePicture);
    }
  }

  fetchAndSaveProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Users/${userId}`).pipe(
      map((user: any) => {
        console.log('[fetchAndSaveProfile] Resposta da BD:', user);
        const pic = user.profilePicture ?? user.ProfilePicture;
        console.log('[fetchAndSaveProfile] profilePicture extraído:', pic);
        if (pic) {
          localStorage.setItem('profilePicture', pic);
        }
        return user;
      }),
    );
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getUserEmail() {
    return localStorage.getItem('email');
  }

  getProfilePicture() {
    return localStorage.getItem('profilePicture');
  }

  logout() {
    localStorage.clear();
  }
}
