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
import { AiService, TextAnalysisResult, ImproveTextResult } from '../../services/ai.service';
import { CollaborationService, CollabUser } from '../../services/collaboration.service';
import { Subscription } from 'rxjs';
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
  Lightbulb,
  Wand2,
  MessageSquareText,
  BookOpen,
  Palette,
  User,
  Users,
  Link,
  Copy,
  RefreshCw
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

  readonly LightbulbIcon = Lightbulb;
  readonly SparklesIcon = Wand2;
  readonly MessageSquareTextIcon = MessageSquareText;
  readonly BookOpenIcon = BookOpen;
  readonly PaletteIcon = Palette;
  readonly UserIcon = User;

  readonly UsersIcon   = Users;
  readonly LinkIcon    = Link;
  readonly CopyIcon    = Copy;
  readonly RefreshIcon = RefreshCw;

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

  activeCollaborators: CollabUser[] = [];
  isCollabConnected: boolean = false;
  private lastLocalEdit: number = 0;
  private collabSendTimer: any;
  private collabSubs: Subscription[] = [];

  //coisas para AI
  showAiPanel: boolean = false;
  aiLoading: boolean = false;
  aiAnalysisResult: TextAnalysisResult | null = null;
  aiImprovementType: 'grammar' | 'vocabulary' | 'style' = 'grammar';

  newProjectData = {
    title: '',
    description: '',
    coverColor: '#6366f1',
    type: 'Livro',
  };
  suggestedColors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  showCollabModal: boolean = false;
  collabTab: 'invite' | 'members' = 'invite';
  collaborators: any[] = [];
  inviteUsername: string = '';
  inviteLoading: boolean = false;
  inviteError: string = '';
  inviteSuccess: string = '';

  // Entrar com código (no dashboard)
  showJoinModal: boolean = false;
  joinCode: string = '';
  joinLoading: boolean = false;
  joinError: string = '';


  editUserData   = { username: '', email: '' };
  originalUserData = { username: '', email: '', profilePicture: '' };

  showChapterModal: boolean = false;
  newChapterData = { title: '', number: 1 };

  constructor(
    private authService: AuthService,
    private aiService: AiService,
    private project: Project,
    private collabService: CollaborationService, 
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
    clearTimeout(this.collabSendTimer);
    this.collabSubs.forEach(s => s.unsubscribe());
    if (this.selectedChapter) {
      const id = this.selectedChapter.Id ?? this.selectedChapter.id;
      this.collabService.leaveChapter(id);
    }
    this.collabService.disconnect();
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
    // Se estava noutro capítulo, sai do grupo anterior
    if (this.selectedChapter) {
      const oldId = this.selectedChapter.Id ?? this.selectedChapter.id;
      this.collabService.leaveChapter(oldId);
      this.collabSubs.forEach(s => s.unsubscribe());
      this.collabSubs = [];
    }

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

    // Liga ao SignalR para este capítulo
    this.startCollaboration(chapter);
  }

  private async startCollaboration(chapter: any) {
    const chapterId = chapter.Id ?? chapter.id;
    const userId    = parseInt(this.authService.getUserId() || '0');
    const username  = this.username || 'Anónimo';

    try {
      await this.collabService.connect(chapterId, userId, username);
      this.isCollabConnected = true;

      // Recebe texto de outros colaboradores
      this.collabSubs.push(
        this.collabService.textReceived$.subscribe(({ content, userId: remoteId }) => {
          if (remoteId === userId) return; // ignora o próprio

          // Só aplica se o utilizador não estiver a escrever ativamente
          const idle = Date.now() - this.lastLocalEdit > 1500;
          if (idle && this.richEditor) {
            this.richEditor.nativeElement.innerHTML = content;
            this.selectedChapter.Content = content;
            this.updateWordCount();
          }
        })
      );

      // Atualiza lista de colaboradores presentes
      this.collabSubs.push(
        this.collabService.activeUsers$.subscribe(users => {
          this.activeCollaborators = users;
        })
      );
      this.collabSubs.push(
        this.collabService.userJoined$.subscribe(user => {
          if (!this.activeCollaborators.find(u => u.userId === user.userId))
            this.activeCollaborators = [...this.activeCollaborators, user];
        })
      );
      this.collabSubs.push(
        this.collabService.userLeft$.subscribe(({ userId: leftId }) => {
          this.activeCollaborators = this.activeCollaborators.filter(u => u.userId !== leftId);
        })
      );

    } catch (err) {
      console.warn('SignalR não disponível — modo offline:', err);
      this.isCollabConnected = false;
    }
  }

  syncEditorContent() {
    if (!this.richEditor) return;
    this.selectedChapter.Content = this.richEditor.nativeElement.innerHTML;
    this.isSaved = false;
    this.updateWordCount();
    this.updateFormatState();

    // Regista quando o utilizador escreveu pela última vez (para o lock de colaboração)
    this.lastLocalEdit = Date.now();

    // Auto-save: 2 segundos após a última tecla
    clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => this.saveChapterContent(), 2000);

    // Envia para colaboradores: 500ms após a última tecla (mais rápido que o save)
    clearTimeout(this.collabSendTimer);
    this.collabSendTimer = setTimeout(() => {
      const chapterId = this.selectedChapter?.Id ?? this.selectedChapter?.id;
      const userId    = parseInt(this.authService.getUserId() || '0');
      if (chapterId && this.isCollabConnected) {
        this.collabService.sendTextUpdate(
          chapterId,
          this.selectedChapter.Content,
          userId
        );
      }
    }, 500);
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

  toggleAiPanel() {
    this.showAiPanel = !this.showAiPanel;
    // Se o painel for aberto e houver um capítulo selecionado, analisa-o
    if (this.showAiPanel && this.selectedChapter && this.selectedChapter.Content) {
      this.analyzeCurrentChapter();
    }
  }

  analyzeCurrentChapter() {
    if (!this.selectedChapter || !this.selectedChapter.Content) {
      this.aiAnalysisResult = null;
      return;
    }

    this.aiLoading = true;
    this.aiService.analyzeText(this.selectedChapter.Content).subscribe({
      next: (result) => {
        this.aiAnalysisResult = result;
        this.aiLoading = false;
      },
      error: (err) => {
        console.error('Erro ao analisar texto com IA:', err);
        this.aiLoading = false;
        this.aiAnalysisResult = null;
        alert('Erro ao analisar texto. Verifica a ligação à API de IA.');
      }
    });
  }

  improveCurrentChapter() {
    if (!this.selectedChapter || !this.selectedChapter.Content || !this.aiImprovementType) {
      return;
    }

    this.aiLoading = true;
    this.aiService.improveText(this.selectedChapter.Content, this.aiImprovementType).subscribe({
      next: (result) => {
        this.selectedChapter.Content = result.improvedText;
        this.isSaved = false; // Marcar como não guardado para o socio salvar
        this.aiLoading = false;

        if (this.richEditor) {
          this.richEditor.nativeElement.innerHTML = result.improvedText;
          this.updateWordCount();
        }

        alert('Texto melhorado com sucesso! Não te esqueças de guardar.');
      },
      error: (err) => {
        console.error('Erro ao melhorar texto com IA:', err);
        this.aiLoading = false;
        alert('Erro ao melhorar texto. Verifica a ligação à API de IA.');
      }
    });
  }

  openCollabModal() {
    this.showCollabModal = true;
    this.collabTab       = 'invite';
    this.inviteError     = '';
    this.inviteSuccess   = '';
    this.inviteUsername  = '';
    this.loadCollaborators();
  }

  closeCollabModal() {
    this.showCollabModal = false;
  }

  loadCollaborators() {
    const projectId = this.selectedProject?.Id ?? this.selectedProject?.id;
    if (!projectId) return;

    this.project.getCollaborators(projectId).subscribe({
      next: (list) => { this.collaborators = list; },
      error: (err)  => console.error('Erro ao carregar colaboradores:', err),
    });
  }

  addCollaboratorByUsername() {
    if (!this.inviteUsername.trim()) return;
    const projectId = this.selectedProject?.Id ?? this.selectedProject?.id;
    const userId    = parseInt(this.authService.getUserId() || '0');

    this.inviteLoading = true;
    this.inviteError   = '';
    this.inviteSuccess = '';

    this.project.addCollaboratorByUsername(projectId, userId, this.inviteUsername.trim())
      .subscribe({
        next: (newCollab) => {
          this.collaborators = [...this.collaborators, newCollab];
          this.inviteSuccess = `${newCollab.Username} adicionado com sucesso!`;
          this.inviteUsername = '';
          this.inviteLoading  = false;
          // Atualiza o projeto para refletir o novo colaborador
          this.project.getProject(projectId).subscribe(p => this.selectedProject = p);
        },
        error: (err) => {
          this.inviteError   = err.error || 'Erro ao adicionar colaborador.';
          this.inviteLoading = false;
        },
      });
  }

  removeCollaborator(collab: any) {
    const projectId       = this.selectedProject?.Id ?? this.selectedProject?.id;
    const requestingUserId = parseInt(this.authService.getUserId() || '0');
    const targetUserId    = collab.UserId ?? collab.userId;

    if (!confirm(`Remover ${collab.Username} do projeto?`)) return;

    this.project.removeCollaborator(projectId, targetUserId, requestingUserId).subscribe({
      next: () => {
        this.collaborators = this.collaborators.filter(
          c => (c.UserId ?? c.userId) !== targetUserId
        );
        this.project.getProject(projectId).subscribe(p => this.selectedProject = p);
      },
      error: (err) => console.error('Erro ao remover colaborador:', err),
    });
  }

  copyInviteCode() {
    const code = this.selectedProject?.InviteCode;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      this.inviteSuccess = 'Código copiado!';
      setTimeout(() => this.inviteSuccess = '', 2000);
    });
  }

  regenerateCode() {
    const projectId = this.selectedProject?.Id ?? this.selectedProject?.id;
    const userId    = parseInt(this.authService.getUserId() || '0');
    if (!confirm('Gerar novo código? O código atual deixará de funcionar.')) return;

    this.project.regenerateInviteCode(projectId, userId).subscribe({
      next: (res) => {
        this.selectedProject.InviteCode = res.InviteCode;
      },
      error: (err) => console.error('Erro ao regenerar código:', err),
    });
  }

  isOwner(): boolean {
    const userId    = parseInt(this.authService.getUserId() || '0');
    const ownerId   = this.selectedProject?.OwnerId ?? this.selectedProject?.ownerId;
    return userId === ownerId;
  }

  // Modal para entrar com código (no dashboard)
  openJoinModal() {
    this.showJoinModal = true;
    this.joinCode      = '';
    this.joinError     = '';
  }

  closeJoinModal() {
    this.showJoinModal = false;
  }

  joinProjectByCode() {
    if (!this.joinCode.trim()) return;
    const userId = parseInt(this.authService.getUserId() || '0');

    this.joinLoading = true;
    this.joinError   = '';

    this.project.joinProjectByCode(userId, this.joinCode.trim()).subscribe({
      next: (res) => {
        this.joinLoading = false;
        this.closeJoinModal();
        alert(res.Message);
        this.loadProjects(); // Atualiza o grid com o novo projeto
      },
      error: (err) => {
        this.joinError   = err.error || 'Código inválido ou já és colaborador.';
        this.joinLoading = false;
      },
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}