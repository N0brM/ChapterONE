import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Project {
  private apiUrl = `${environment.apiUrl}/api/Projects`;
  private chapUrl = `${environment.apiUrl}/api/Chapters`;
  private usersUrl = `${environment.apiUrl}/api/Users`;
  private uploadUrl = `${environment.apiUrl}/api/Upload`;
    private aiUrl     = `${environment.apiUrl}/api/AI`;

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

  //Utilizadores

  getUser(userId: string | number): Observable<any> {
    return this.http.get<any>(`${this.usersUrl}/${userId}`);
  }

  updateUserProfile(userId: string | number, data: any): Observable<any> {
    return this.http.put(`${this.usersUrl}/${userId}`, data);
  }

  uploadProfilePicture(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.uploadUrl}/profile-picture/${userId}`, formData);
  }

  //AI
  analyzeText(text: string): Observable<any> {
    // Remove tags HTML antes de enviar
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return this.http.post(`${this.aiUrl}/analyze`, { Text: cleanText });
  }

  assistWriting(text: string, question: string): Observable<any> {
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return this.http.post(`${this.aiUrl}/assist`, { Text: cleanText, Question: question });
  }

  //! SignalR
  private collabUrl = `${environment.apiUrl}/api/Collaborators`;

  // Lista colaboradores de um projeto
  getCollaborators(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.collabUrl}/${projectId}`);
  }

  // Adiciona colaborador por username (só o dono)
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

  // Entra num projeto com código de convite
  joinProjectByCode(userId: number, code: string): Observable<any> {
    return this.http.post(`${this.collabUrl}/join`, { UserId: userId, Code: code });
  }

  // Remove colaborador
  removeCollaborator(
    projectId: number,
    userId: number,
    requestingUserId: number
  ): Observable<any> {
    return this.http.delete(
      `${this.collabUrl}/${projectId}/${userId}?requestingUserId=${requestingUserId}`
    );
  }

  // Gera novo código de convite
  regenerateInviteCode(projectId: number, requestingUserId: number): Observable<any> {
    return this.http.post(
      `${this.collabUrl}/regenerate-code/${projectId}?requestingUserId=${requestingUserId}`,
      {}
    );
  }
}