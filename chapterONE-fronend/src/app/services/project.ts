import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private apiUrl = `${environment.apiUrl}/api/Projects`;

  constructor(private http: HttpClient) {}

  getUserProjects(userId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}` );
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  addChapter(chapter: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Chapters`, chapter );
  }

  deleteChapter(chapterId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Chapters/${chapterId}`);
  }
}
