import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../services/project';
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
  Terminal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Book,
  Film,
  Tv,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('richEditor') richEditor?: ElementRef<HTMLDivElement>;

  // icons lucide??
  readonly EditIcon       = Edit2;
  readonly TrashIcon      = Trash2;
  readonly SettingsIcon   = Settings;
  readonly PlusIcon       = Plus;
  readonly BackIcon       = ArrowLeft;
  readonly LogoutIcon     = LogOut;
  readonly CloseIcon      = X;
  readonly BoldIcon       = Bold;
  readonly ItalicIcon     = Italic;
  readonly UnderlineIcon  = Underline;
  readonly SaveIcon       = Save;
  readonly SidebarIcon    = PanelLeft;
  readonly SunIcon        = Sun;
  readonly MoonIcon       = Moon;
  readonly RetroIcon      = Monitor;
  readonly TerminalIcon   = Terminal;
  readonly AlignLeftIcon  = AlignLeft;
  readonly AlignCenterIcon= AlignCenter;
  readonly AlignRightIcon = AlignRight;
  readonly UndoIcon       = Undo2;
  readonly BookIcon       = Book;
  readonly FilmIcon       = Film;
  readonly TvIcon         = Tv;

  username: string | null = '';
  projects: any[] = [];
  newAvatarUrl: string = '';
  viewMode: 'grid' | 'form' | 'details' | 'editor' | 'settings' = 'grid';
  selectedProject: any = null;
  selectedChapter: any = null;
  currentTheme: string = 'modern-light';

  isSideBarOpen: boolean = false;
  isSaved: boolean = true;
  wordCount: number = 0;
  isBold: boolean = false;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  private autoSaveTimer: any;

  //projetc types assim pode ser outras coisas sem ser livro
  projectTypes = [
    { value: 'Livro',  label: 'Livro',  emoji: '📖' },
    { value: 'Serie',  label: 'Série',  emoji: '📺' },
    { value: 'Filme',  label: 'Filme',  emoji: '🎬' },
  ];

  newProjectData = {
    title: '',
    description: '',
    coverColor: '#6366f1',
    type: 'Livro',
  };
  suggestedColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  editUserData   = { username: '', email: '' };
  originalUserData = { username: '', email: '', profilePicture: '' };

  showChapterModal: boolean = false;
  newChapterData = { title: '', number: 1 };

  constructor(
    private authService: AuthService,
    private project: Project,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('selected-theme') || 'modern-light';
    this.setTheme(savedTheme);

    this.username = this.authService.getUsername();
    if (!this.username) {
      this.router.navigate(['/login']);
      return;
    }

    this.editUserData.username = this.username || '';
    this.editUserData.email    = this.authService.getUserEmail() || '';

    const savedPhoto = this.authService.getProfilePicture();
    if (savedPhoto) {
      this.newAvatarUrl = savedPhoto.startsWith('http')
        ? savedPhoto
        : `${this.authService['apiUrl'] || 'https://localhost:7257'}${savedPhoto}`;
    }

    this.originalUserData = {
      username:       this.editUserData.username,
      email:          this.editUserData.email,
      profilePicture: this.newAvatarUrl,
    };

    this.loadProjects();
  }

  ngOnDestroy() {
    clearTimeout(this.autoSaveTimer);
  }

  loadProjects() {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.project.getUserProjects(userId).subscribe({
      next: (data) => { this.projects = data; },
      error: (err) => console.error('Erro ao carregar projetos:', err),
    });
  }

  onCreateProject() {
    const userId = this.authService.getUserId();
    if (!userId || !this.newProjectData.title.trim()) return;

    const payload = {
      Title:       this.newProjectData.title,
      Description: this.newProjectData.description,
      OwnerId:     parseInt(userId),
      CoverColor:  this.newProjectData.coverColor,
      ProjectType: this.newProjectData.type,
      Chapters:    [],
    };

    this.project.createProject(payload).subscribe({
      next: () => this.showGrid(),
      error: (err) => console.error('Erro ao criar projeto:', err),
    });
  }

  deleteProject(project: any, event: MouseEvent) {
    event.stopPropagation();
    const id = project.Id ?? project.id;
    if (!confirm(`Apagar "${project.Title}"? Esta ação não pode ser desfeita.`)) return;

    this.project.deleteProject(id).subscribe({
      next: () => this.loadProjects(),
      error: (err) => console.error('Erro ao apagar projeto:', err),
    });
  }

  openProject(project: any) {
    this.selectedProject = project;
    this.viewMode = 'details';
  }

  showNewProjectForm() {
    this.viewMode = 'form';
    this.newProjectData = { title: '', description: '', coverColor: '#6366f1', type: 'Livro' };
  }

  showGrid() {
    this.viewMode = 'grid';
    this.selectedProject = null;
    this.loadProjects();
  }

  setCoverColor(color: string) {
    this.newProjectData.coverColor = color;
  }

  getTypeEmoji(type: string): string {
    return this.projectTypes.find(t => t.value === type)?.emoji || '📖';
  }

  openAddChapterModal() {
    this.showChapterModal = true;
    const nextNum = (this.selectedProject?.Chapters?.length || 0) + 1;
    this.newChapterData = { title: '', number: nextNum };
  }

  closeChapterModal() {
    this.showChapterModal = false;
  }

  onSaveChapter() {
    if (!this.selectedProject || !this.newChapterData.title.trim()) return;

    const projectId = this.selectedProject.Id ?? this.selectedProject.id;
    const payload = {
      Title:     this.newChapterData.title,
      Order:     this.newChapterData.number,
      ProjectId: projectId,
    };

    this.project.addChapter(payload).subscribe({
      next: () => {
        this.project.getProject(projectId).subscribe({
          next: (updated) => {
            this.selectedProject = updated;
            this.loadProjects();
          },
        });
        this.closeChapterModal();
      },
      error: (err) => console.error('Erro ao adicionar capítulo:', err),
    });
  }

  deleteChapter(chapter: any) {
    const id = chapter.Id ?? chapter.id;
    if (!confirm(`Apagar o capítulo "${chapter.Title}"?`)) return;

    this.project.deleteChapter(id).subscribe({
      next: () => {
        this.selectedProject.Chapters = this.selectedProject.Chapters.filter(
          (c: any) => (c.Id ?? c.id) !== id,
        );
      },
      error: (err) => console.error('Erro ao apagar capítulo:', err),
    });
  }

  editChapter(chapter: any) {
    this.selectedChapter = { ...chapter };
    this.isSaved = true;

    const content = chapter.Content ?? chapter.content ?? '';

    if (this.viewMode === 'editor') {
      if (this.richEditor) {
        this.richEditor.nativeElement.innerHTML = content;
        this.updateWordCount();
      }
    } else {
      this.viewMode = 'editor';
      this.cdr.detectChanges(); 
      if (this.richEditor) {
        this.richEditor.nativeElement.innerHTML = content;
        this.updateWordCount();
      }
    }
  }

  syncEditorContent() {
    if (!this.richEditor) return;
    this.selectedChapter.Content = this.richEditor.nativeElement.innerHTML;
    this.isSaved = false;
    this.updateWordCount();
    this.updateFormatState();

    // Auto-save: guarda 2 segundos depois da última tecla
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => this.saveChapterContent(), 2000);
  }

  updateWordCount() {
    const text = this.richEditor?.nativeElement.innerText
              ?? this.selectedChapter?.Content
              ?? '';
    const cleaned = text.replace(/<[^>]*>/g, '').trim();
    this.wordCount = cleaned ? cleaned.split(/\s+/).length : 0;
  }

  format(command: string, value?: string) {
    document.execCommand(command, false, value);
    this.richEditor?.nativeElement.focus();
    this.syncEditorContent();
  }

  formatBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
    this.richEditor?.nativeElement.focus();
    this.syncEditorContent();
  }

  updateFormatState() {
    this.isBold      = document.queryCommandState('bold');
    this.isItalic    = document.queryCommandState('italic');
    this.isUnderline = document.queryCommandState('underline');
  }

  saveChapterContent() {
    if (!this.selectedChapter || !this.selectedProject) return;

    const chapterId = this.selectedChapter.Id ?? this.selectedChapter.id;
    const projectId = this.selectedProject.Id  ?? this.selectedProject.id;

    if (!chapterId || !projectId) {
      console.error('ID do capítulo ou projeto em falta', { chapterId, projectId });
      return;
    }

    const payload = {
      Id:        chapterId,
      Title:     this.selectedChapter.Title  ?? this.selectedChapter.title,
      Order:     this.selectedChapter.Order  ?? this.selectedChapter.order,
      Content:   this.selectedChapter.Content,
      ProjectId: projectId,
    };

    this.project.updateChapter(payload).subscribe({
      next: () => {
        this.isSaved = true;
        this.project.getProject(projectId).subscribe(p => {
          this.selectedProject = p;
        });
      },
      error: (err) => console.error('Erro ao guardar capítulo:', err),
    });
  }

  toggleSidebar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  goToSettings() {
    this.viewMode = 'settings';
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    const body = document.body;
    body.classList.remove('dark-theme', 'retro-light', 'retro-dark');
    if (theme !== 'modern-light') body.classList.add(theme);
    localStorage.setItem('selected-theme', theme);
  }

  updateUserProfile() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const payload = {
      Username:       this.editUserData.username,
      Email:          this.editUserData.email,
      PreferredTheme: this.currentTheme,
    };

    this.project.updateUserProfile(userId, payload).subscribe({
      next: (res: any) => {
        this.username = res.username || this.editUserData.username;
        localStorage.setItem('username',        this.editUserData.username);
        localStorage.setItem('email',           this.editUserData.email);
        localStorage.setItem('selected-theme',  this.currentTheme);

        this.originalUserData = {
          username:       this.editUserData.username,
          email:          this.editUserData.email,
          profilePicture: this.newAvatarUrl,
        };

        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => console.error('Erro ao atualizar perfil:', err),
    });
  }

  hasProfileChanges(): boolean {
    return (
      this.editUserData.username !== this.originalUserData.username ||
      this.editUserData.email    !== this.originalUserData.email    ||
      this.newAvatarUrl          !== this.originalUserData.profilePicture ||
      this.currentTheme          !== localStorage.getItem('selected-theme')
    );
  }

  triggerProfileUpload() {
    (document.getElementById('profileInput') as HTMLInputElement)?.click();
  }

  onProfilePictureSelected(event: any) {
    const file: File = event.target.files[0];
    const userId = this.authService.getUserId();
    if (!file || !userId) return;

    this.project.uploadProfilePicture(parseInt(userId), file).subscribe({
      next: (res: any) => {
        this.newAvatarUrl = `https://localhost:7257${res.url}`;
        localStorage.setItem('profilePicture', res.url);
        this.originalUserData.profilePicture = this.newAvatarUrl;
      },
      error: (err) => console.error('Erro no upload:', err),
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}