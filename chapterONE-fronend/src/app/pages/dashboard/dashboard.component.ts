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
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  username: string | null = '';
  projects: any[] = [];

  viewMode: 'grid' | 'form' = 'grid';

  newProjectData = {
    title: '',
    description: ''
  }

  constructor(
    private authService: AuthService,
    private project: Project,
    private router: Router
  ){}

  ngOnInit()
  {
    this.username = this.authService.getUsername();
    if(!this.username)
    {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProjects();
  }

  loadProjects() 
  {
    const userId = this.authService.getUserId();
    if (userId) {
      this.project.getUserProjects(userId).subscribe({
        next: (data: any) => {
          console.log('Projetos carregados:', data);
          this.projects = data;
        },
        error: (err) => {
          console.error('Erro ao carregar projetos:', err);
        }
      });
    }
  }
  
  onCreateProject() 
  {
    const userId = this.authService.getUserId();
    if(!userId) return;

    const payload = {
      Title: this.newProjectData.title,
      Description: this.newProjectData.description,
      UserId: userId,
      Chapters: [],
      Owner: {},
      Collaborators: []
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
      }
    })
  }

  showNewProjectForm()
  {
    this.viewMode = 'form';
    this.newProjectData = { title: '', description: ''};
  }

  showGrid()
  {
    this.viewMode = 'grid';
    this.loadProjects();
  }

  createNewProject()
  {
    console.log('A tentar criar novo projeto');
    this.router.navigate(['/new-project']);
  }

  openProject(projectId: number)
  {
    this.router.navigate(['/project', projectId]);
  }

  onLogout()
  {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
