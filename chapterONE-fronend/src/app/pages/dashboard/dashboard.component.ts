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
  // Themes icons yah to be used
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
    coverColor: '#6366f1',
    coverUrl: ''
  };
  suggestedColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']; 

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
      coverUrl: this.newProjectData.coverUrl,
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
    this.newProjectData = { title: '', description: '', coverColor: '#6366f1', coverUrl: '' };
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

  // CORREÇÃO: Usar 'ProjectId' com 'P' maiúsculo para coincidir com o Backend
  const chapterPayload = {
    Title: this.newChapterData.title,
    Order: this.newChapterData.number,
    ProjectId: this.selectedProject.Id || this.selectedProject.id 
  };

  console.log('A enviar capítulo:', chapterPayload); // Para debug

  this.project.addChapter(chapterPayload).subscribe({
    next: (res) => {
      console.log('Capítulo adicionado com sucesso:', res);
      // Atualiza o projeto selecionado para mostrar o novo capítulo na lista
      this.project.getProject(chapterPayload.ProjectId).subscribe({
        next: (updatedProject) => {
          this.selectedProject = updatedProject;
          this.loadProjects();
        },
      });
      this.closeChapterModal();
    },
    error: (err) => {
      console.error('Erro detalhado da API:', err);
      alert('Erro ao adicionar capítulo. Verifica a consola para mais detalhes.');
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

  //! NAO FUNCIONA, tenho de arranjar ASAP
  saveChapterContent() {
  const chapterId = this.selectedChapter.Id || this.selectedChapter.id;
  const projectId = this.selectedProject.Id || this.selectedProject.id;

  if (!chapterId || !projectId) {
    console.error('Erro: ID do capítulo ou do projeto não encontrado', { chapterId, projectId });
    alert('Erro interno: Não foi possível identificar o capítulo.');
    return;
  }

  const payload = {
    Id: chapterId,
    Title: this.selectedChapter.Title,
    Order: this.selectedChapter.Order,
    Content: this.selectedChapter.Content,
    ProjectId: projectId
  };

  console.log('A guardar capítulo no URL:', `https://localhost:7257/api/Chapters/${chapterId}` );
  console.log('Payload enviado:', payload);

  this.project.updateChapter(payload).subscribe({
    next: () => {
      this.isSaved = true;
      console.log('Capítulo guardado com sucesso!');
      this.project.getProject(projectId).subscribe(p => {
        this.selectedProject = p;
      });
    },
    error: (err) => {
      console.error('Erro ao guardar capítulo:', err);
      alert('Erro ao guardar. Verifica a consola para ver os detalhes da validação.');
    },
  });
}


  goToSettings() {
    this.viewMode = 'settings';
  }

  //TODO: Ter um espaço de personalização do perfil
  updateUserProfile() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const payload = {
      Id: userId,
      Username: this.username,
      ProfilePicture: this.newAvatarUrl,
      PreferredTheme: this.currentTheme
    };

    this.project.updateUserProfile(userId, payload).subscribe({
      next: () => {
        alert('Perfil atualizado com sucesso!');
        // Podes atualizar o avatar local aqui se quiseres
      },
      error: (err) => console.error('Erro ao atualizar perfil:', err)
    });
  }

  // Método para selecionar cor da capa
  setCoverColor(color: string) {
    this.newProjectData.coverColor = color;
  }

  // TODO: De momento funcionao, tenho de melhorar
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
