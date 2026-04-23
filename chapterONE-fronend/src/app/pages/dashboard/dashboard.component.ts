import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../services/project';
import { Title } from '@angular/platform-browser';
import { response } from 'express';
import { LucideAngularModule, Edit2, Trash2, Settings, Plus, ArrowLeft, LogOut, X } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  username: string | null = '';
  projects: any[] = [];

  //icones do lucide??
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly SettingsIcon = Settings;
  readonly PlusIcon = Plus;
  readonly BackIcon = ArrowLeft;
  readonly LogoutIcon = LogOut;
  readonly CloseIcon = X;

  newAvatarUrl: string = '';

  viewMode: 'grid' | 'form' | 'details' | 'editor' | 'settings'= 'grid';

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
    const projectId = this.selectedProject.Id;

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
            const updatedProject = this.projects.find((p) => (p.Id) === projectId);
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
    const chapterId = chapter.Id;

    if (confirm(`Queres mesmo apagar o capítulo "${chapter.Title}"?`)) {
      this.project.deleteChapter(chapterId).subscribe({
        next: () => {
          alert('Capítulo removido!');
          this.selectedProject.Chapters = this.selectedProject.Chapters.filter(
            (c: any) => (c.Id) !== chapterId,
          );
        },
        error: (err: any) => {
          console.error('Erro:', err);
        },
      });
    }
  }

  editChapter(chapter: any) {
    console.log('A entrar no editor:', chapter.Title);
    this.selectedChapter = { ...chapter };
    this.viewMode = 'editor';
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
    if (!this.selectedChapter || !this.selectedChapter.Id) return;
    const chapterId: number = this.selectedChapter.Id;
    const currentUserId = this.authService.getUserId();
    
    if (!currentUserId) {
    console.error("Utilizador não autenticado!");
      return;
    }

    const payload = {
      Id: this.selectedChapter.Id,
      Title: this.selectedChapter.Title,
      Order: this.selectedChapter.Order,
      Content: this.selectedChapter.Content,
      ProjectId: this.selectedProject.Id,
      Project: null,
    };

    this.project.updateChapter(payload).subscribe({
      next: (res) => {
      this.isSaved = true;

      this.project.getUserProjects(currentUserId).subscribe({
        next: (data: any) => {
          this.projects = data;

          
          const updatedProject = this.projects.find(p => p.Id === this.selectedProject.Id);
          if (updatedProject) {
            this.selectedProject = updatedProject;
            const updatedChapter = updatedProject.Chapters.find((c: any) => c.Id === chapterId);
            if (updatedChapter) {
              this.selectedChapter = updatedChapter;
            }
          }
          console.log('Capítulo e lista atualizados!');
        }
      });
    },
      error: (err) => {
        console.error('Erro ao guardar capítulo:', err);
        alert('Erro ao guardar. Verifica a ligação à API.');
      },
    });
  }

  goToSettings(){
    this.viewMode = 'settings';
  }

  updateUserProfile(){
    console.log('atualizatings the profiles');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}