import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private apiUrl    = `${environment.apiUrl}/api/Projects`;
  private chapUrl   = `${environment.apiUrl}/api/Chapters`;
  private usersUrl  = `${environment.apiUrl}/api/Users`;
  private uploadUrl = `${environment.apiUrl}/api/Upload`;
  private collabUrl = `${environment.apiUrl}/api/Collaborators`;
  private refsUrl   = `${environment.apiUrl}/api/References`;

  constructor(private http: HttpClient) {}

  // Projetos 

  getUserProjects(userId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getProject(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProject(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateProject(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  uploadChapterImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/api/Upload/chapter-image`, formData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  //Capítulos

  getChapter(id: number): Observable<any> {
    return this.http.get<any>(`${this.chapUrl}/${id}`);
  }

  addChapter(chapter: any): Observable<any> {
    return this.http.post(this.chapUrl, chapter);
  }

  updateChapter(chapter: any): Observable<any> {
    const id = chapter.Id ?? chapter.id;
    return this.http.put(`${this.chapUrl}/${id}`, chapter);
  }

  deleteChapter(chapterId: number): Observable<any> {
    return this.http.delete(`${this.chapUrl}/${chapterId}`);
  }

  // Utilizadores

  getUser(userId: string | number): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`);
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/Users/${userId}`);
  }

  updateUserProfile(userId: string | number, data: any): Observable<any> {
    return this.http.put(`${this.usersUrl}/${userId}`, data);
  }

  uploadProfilePicture(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uploadUrl}/profile-picture/${userId}`, formData);
  }

  uploadProjectCover(projectId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uploadUrl}/project-cover/${projectId}`, formData);
  }

  uploadReferenceImage(referenceId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uploadUrl}/reference-image/${referenceId}`, formData);
  }

  // Colaboradores 

  getCollaborators(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.collabUrl}/${projectId}`);
  }

  addCollaboratorByUsername(
    projectId: number,
    requestingUserId: number,
    username: string
  ): Observable<any> {
    return this.http.post(`${this.collabUrl}/add-by-username`, {
      ProjectId:        projectId,
      RequestingUserId: requestingUserId,
      Username:         username,
    });
  }

  joinProjectByCode(userId: number, code: string): Observable<any> {
    return this.http.post(`${this.collabUrl}/join`, { UserId: userId, Code: code });
  }

  removeCollaborator(
    projectId: number,
    userId: number,
    requestingUserId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.collabUrl}/${projectId}/${userId}?requestingUserId=${requestingUserId}`
    );
  }

  regenerateInviteCode(projectId: number, requestingUserId: number): Observable<any> {
    return this.http.post(
      `${this.collabUrl}/regenerate-code/${projectId}?requestingUserId=${requestingUserId}`,
      {}
    );
  }

  //Referências 

  getReferences(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.refsUrl}/project/${projectId}`);
  }

  createReference(ref: any): Observable<any> {
    return this.http.post(this.refsUrl, ref);
  }

  updateReference(id: number, ref: any): Observable<any> {
    return this.http.put(`${this.refsUrl}/${id}`, ref);
  }

  deleteReference(id: number): Observable<any> {
    return this.http.delete(`${this.refsUrl}/${id}`);
  }
}
