import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';
import { ProjectCard } from '../../components/project-card/project-card';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [
    CommonModule, 
    Sidebar, 
    Header, 
    ProjectCard
  ], 
  templateUrl: './dashboard.html', 
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  myProjects = [
    { id: 1, title: 'Projeto 1'},
    { id: 2, title: 'Projeto 2'},
    { id: 3, title: 'Projeto 3'},
    { id: 4, title: 'Projeto 4'},
    { id: 5, title: 'Projeto 5'},
    { id: 6, title: 'Projeto 6'},
    { id: 7, title: 'Projeto 7'},
    { id: 8, title: 'Projeto 8'},
    { id: 9, title: 'Projeto 9'},
    { id: 10, title: 'Projeto 10'},
  ];
}