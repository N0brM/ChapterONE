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

  viewMode: 'grid' | 'form' | 'details' | 'editor' = 'grid';

  selectedProject: any = null;
  selectedChapter: any = null;

  isSideBarOpen: boolean = false;
  isSaved: boolean = true;
  wordCount: number = 0;

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
    const projectId = this.selectedProject.id || this.selectedProject.Id;

    const chapterPayload = {
      Title: this.newChapterData.title,
      Order: parseInt(this.newChapterData.number.toString()),
      ProjectId: parseInt(projectId.toString()),
      Project: null,
    };

    this.project.addChapter(chapterPayload).subscribe({
      next: (response: any) => {
        this.project.getUserProjects(this.authService.getUserId()!).subscribe({
          next: (data: any[]) => {
            this.projects = data;
            const updatedProject = this.projects.find((p) => (p.id || p.Id) === projectId);
            if (updatedProject) {
              this.selectedProject = updatedProject;
            }
          },
        });

        this.closeChapterModal();
      },
      error: (err) => {
        console.error('Erro na API:', err);
      },
    });
  }

  deleteChapter(chapter: any) {
    const chapterId = chapter.Id || chapter.id;

    if (confirm(`Queres mesmo apagar o capítulo "${chapter.Title}"?`)) {
      this.project.deleteChapter(chapterId).subscribe({
        next: () => {
          alert('Capítulo removido!');
          this.selectedProject.Chapters = this.selectedProject.Chapters.filter(
            (c: any) => (c.Id || c.id) !== chapterId,
          );
        },
        error: (err: any) => {
          console.error('Erro:', err);
        },
      });
    }
  }

  editChapter(chapter: any) {
    console.log('A entrar no modo Zen Editor:', chapter.Title);
    this.selectedChapter = { ...chapter };
    this.viewMode = 'editor';
    this.isSideBarOpen = false;
    this.isSaved = true;
    this.updateWordCount();
  }

  toggleSidebar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  updateWordCount() {
    const text = this.selectedChapter?.Content || '';
    this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  onContentChange() {
    this.isSaved = false;
    this.updateWordCount();
  }

  saveChapterContent() {
    if (!this.selectedChapter) return;

    const payload = {
      Id: this.selectedChapter.Id || this.selectedChapter.id,
      Title: this.selectedChapter.Title || this.selectedChapter.title,
      Order: this.selectedChapter.Order || this.selectedChapter.order,
      Content: this.selectedChapter.Content,
      ProjectId: this.selectedProject.Id || this.selectedProject.id,
      Project: null,
    };

    this.project.updateChapter(payload).subscribe({
      next: (res) => {
        this.isSaved = true;
        console.log('Capítulo guardado com sucesso!');
        this.loadProjects();
      },
      error: (err) => {
        console.error('Erro ao guardar capítulo:', err);
        alert('Erro ao guardar. Verifica a ligação à API.');
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
