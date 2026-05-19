import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../services/project';
import { Title } from '@angular/platform-browser';
//? imports do lucide
import {
  LucideAngularModule,
  Edit2,
  Trash2,
  Settings,
  Plus,
  ArrowLeft,
  LogOut,
  X,
  Bold,
  Italic,
  Underline,
  Save,
  PanelLeft,
  Sun,
  Moon,
  Monitor,
  Terminal
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  username: string | null = '';
  projects: any[] = [];

  //? icones do lucide??
  readonly EditIcon = Edit2;
  readonly TrashIcon = Trash2;
  readonly SettingsIcon = Settings;
  readonly PlusIcon = Plus;
  readonly BackIcon = ArrowLeft;
  readonly LogoutIcon = LogOut;
  readonly CloseIcon = X;
  readonly BoldIcon = Bold;
  readonly ItalicIcon = Italic;
  readonly UnderlineIcon = Underline;
  readonly SaveIcon = Save;
  readonly SidebarIcon = PanelLeft;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly RetroIcon = Monitor;
  readonly TerminalIcon = Terminal;

  newAvatarUrl: string = '';

  viewMode: 'grid' | 'form' | 'details' | 'editor' | 'settings' = 'grid';

  selectedProject: any = null;
  selectedChapter: any = null;

  isSideBarOpen: boolean = false;
  isSaved: boolean = true;
  wordCount: number = 0;

  newProjectData = {
    title: '',
    description: '',
    coverColor: '#6366f1'
  };

  showChapterModal: boolean = false;
  newChapterData = { title: '', number: 1 };

  currentTheme: string = 'modern-light';

  constructor(
    private authService: AuthService,
    private project: Project,
    private router: Router,
  ) {}

  ngOnInit() {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('selected-theme') || 'modern-light';
    this.setTheme(savedTheme);

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

    if (!userId) return;

    const payload = {
      title: this.newProjectData.title,
      description: this.newProjectData.description,
      ownerId: parseInt(userId),
      coverColor: this.newProjectData.coverColor,
      chapters: []
    };

    this.project.createProject(payload).subscribe({
      next: () => {
        this.showGrid();
      },
      error: (err) => {
        console.error('Erro ao criar projeto:', err);
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
    this.newProjectData = { title: '', description: '', coverColor: '#6366f1' };
  }

  showGrid() {
    this.viewMode = 'grid';
    this.selectedProject = null;
    this.loadProjects();
  }

  openAddChapterModal() {
    this.showChapterModal = true;
    const nextNum = (this.selectedProject?.chapters?.length || 0) + 1;
    this.newChapterData = { title: '', number: nextNum };
  }

  closeChapterModal() {
    this.showChapterModal = false;
  }

  onSaveChapter() {
    if (!this.selectedProject) return;

    const chapterPayload = {
      title: this.newChapterData.title,
      order: this.newChapterData.number,
      projectId: this.selectedProject.id
    };

    this.project.addChapter(chapterPayload).subscribe({
      next: () => {
        this.project.getProject(this.selectedProject.id).subscribe({
          next: (updatedProject) => {
            this.selectedProject = updatedProject;
            this.loadProjects();
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
    if (confirm(`Queres mesmo apagar o capítulo "${chapter.title}"?`)) {
      this.project.deleteChapter(chapter.id).subscribe({
        next: () => {
          this.selectedProject.chapters = this.selectedProject.chapters.filter(
            (c: any) => c.id !== chapter.id,
          );
        },
        error: (err: any) => {
          console.error('Erro:', err);
        },
      });
    }
  }

  editChapter(chapter: any) {
    console.log('A entrar no editor:', chapter.title);
    this.selectedChapter = { ...chapter };
    this.viewMode = 'editor';
    this.isSaved = true;
    this.updateWordCount();
  }

  toggleSidebar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  updateWordCount() {
    const text = this.selectedChapter?.content || '';
    this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  onContentChange() {
    this.isSaved = false;
    this.updateWordCount();
  }

  saveChapterContent() {
    if (!this.selectedChapter || !this.selectedProject) return;

    const payload = {
      id: this.selectedChapter.id,
      title: this.selectedChapter.title,
      order: this.selectedChapter.order,
      content: this.selectedChapter.content,
      projectId: this.selectedProject.id
    };

    this.project.updateChapter(payload).subscribe({
      next: () => {
        this.isSaved = true;
        this.project.getProject(this.selectedProject.id).subscribe(p => {
          this.selectedProject = p;
        });
        console.log('Capítulo e lista atualizados!');
      },
      error: (err) => {
        console.error('Erro ao guardar capítulo:', err);
        alert('Erro ao guardar. Verifica a ligação à API.');
      },
    });
  }

  goToSettings() {
    this.viewMode = 'settings';
  }

  //todo Ter um espaço de personalização do perfil
  updateUserProfile() {
    console.log('atualizatings the profiles');
  }

  // todo De momento não funciona de todo, tenho de mexer no backend e na base de dados para incluir espaços de 'prefered-theme' ou algo assim
  setTheme(theme: string) {
    this.currentTheme = theme;
    const body = document.body;

    body.classList.remove('dark-theme', 'retro-light', 'retro-dark');

    if (theme !== 'modern-light') {
      body.classList.add(theme);
    }

    localStorage.setItem('selected-theme', theme);
    console.log('Tema alterado para: ' + theme);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
