import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../services/project';
import { Title } from '@angular/platform-browser';
import { response } from 'express';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  username: string | null = '';
  projects: any[] = [];

  viewMode: 'grid' | 'form' | 'details' = 'grid';

  selectedProject: any = null;

  newProjectData = {
    title: '',
    description: '',
  };

  showChapterModal: boolean = false;
  newChapterData = { title: '', number: 1 };

  constructor(
    private authService: AuthService,
    private project: Project,
    private router: Router,
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    if (!this.username) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProjects();
  }

  loadProjects() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.project.getUserProjects(userId).subscribe({
        next: (data: any) => {
          this.projects = data;
        },
        error: (err) => console.error('Erro ao carregar projetos:', err),
      });
    }
  }

  onCreateProject() {
    const userId = this.authService.getUserId();
    console.log('ID do utilizador a criar o projeto:', userId);

    const username = this.authService.getUsername();
    if (!userId) return;

    const payload = {
      Title: this.newProjectData.title,
      Description: this.newProjectData.description,
      OwnerId: parseInt(userId || '0'),
      Chapters: [],
      Owner: null,
      Collaborators: [],
    };

    this.project.createProject(payload).subscribe({
      next: (response: any) => {
        this.showGrid();
      },
      error: (err) => {
        if (err.status === 200 || err.status === 201) {
          this.showGrid();
        } else {
          console.error('Erro ao criar projeto:', err);
          alert('Erro ao criar projeto.');
        }
      },
    });
  }

  openProject(project: any) {
    console.log('Abrir detalhes do projeto:', project);
    this.selectedProject = project;
    this.viewMode = 'details';
  }

  showNewProjectForm() {
    this.viewMode = 'form';
    this.newProjectData = { title: '', description: '' };
  }

  showGrid() {
    this.viewMode = 'grid';
    this.selectedProject = null;
    this.loadProjects();
  }

  createNewProject() {
    console.log('A tentar criar novo projeto');
    this.router.navigate(['/new-project']);
  }

  openAddChapterModal() {
    this.showChapterModal = true;
    const nextNum = (this.selectedProject.Chapters?.length || 0) + 1;
    this.newChapterData = { title: '', number: nextNum };
  }

  closeChapterModal() {
    this.showChapterModal = false;
  }

  onSaveChapter() {
    const chapterPayload = {
      Title: this.newChapterData.title,
      Order: this.newChapterData.number,
      ProjectId: this.selectedProject.Id || this.selectedProject.id,
      Content: '',
    };

    this.project.createChapter(chapterPayload).subscribe({
      next: (chapterCriado: any) => {
        if (!this.selectedProject.Chapters) {
          this.selectedProject.Chapters = [];
        }

        this.selectedProject.Chapters.push(chapterCriado);

        console.log('Capítulo guardado na BD:', chapterCriado);
        this.closeChapterModal();
      },
      error: (err) => {
        console.error('Erro ao guardar capítulo no servidor:', err);
        alert('Erro: O capítulo não foi salvo. Verifica a ligação ou o servidor.');
      },
    });
  }

  editChapter(chapter: any) {
    console.log('Editar capítulo:', chapter);
  }

  deleteChapter(chapter: any) {
    if (confirm(`Tem a certeza que quer apagar o capítulo "${chapter.Title}"?`)) {
      console.log('Apagar capítulo:', chapter);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
