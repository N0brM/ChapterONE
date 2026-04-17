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
    const projectId = this.selectedProject.id || this.selectedProject.Id;

    const chapterPayload = {
      Title: this.newChapterData.title,
      Order: parseInt(this.newChapterData.number.toString()),
      ProjectId: parseInt(projectId.toString()),
      Project: null
    };

    this.project.addChapter(chapterPayload).subscribe({
      next: (response: any) => {
        alert('Capítulo guardado com sucesso!');
      
        this.project.getUserProjects(this.authService.getUserId()!).subscribe({
          next: (data: any[]) => {
            this.projects = data;
            const updatedProject = this.projects.find(p => (p.id || p.Id) === projectId);
            if (updatedProject) {
              this.selectedProject = updatedProject;
            }
          }
        });

        this.closeChapterModal();
      },
      error: (err) => {
        console.error('Erro na API:', err);
        alert('Erro ao gravar.');
      }
    });
  }


  editChapter(chapter: any) {
    console.log('Editar capítulo:', chapter);
  }

  deleteChapter(chapter: any) {
    const chapterId = chapter.Id || chapter.id;

    if (confirm(`Queres mesmo apagar o capítulo "${chapter.Title}"?`)) {
      // Agora passamos o ID que o serviço espera
      this.project.deleteChapter(chapterId).subscribe({
        next: () => {
          alert('Capítulo removido!');
          // Atualiza a lista no ecrã
          this.selectedProject.Chapters = this.selectedProject.Chapters.filter(
            (c: any) => (c.Id || c.id) !== chapterId
          );
        },
        error: (err: any) => {
          console.error('Erro:', err);
          alert('Erro ao apagar o capítulo.');
        }
      });
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}