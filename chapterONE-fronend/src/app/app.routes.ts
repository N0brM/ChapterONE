import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { ProjectDetailComponent } from './pages/project-detail/project-detail';
import { LoginComponent } from './auth/login/login';
import { WritingSpaceComponent } from './pages/writing-space/writing-space';

export const routes: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'project-detail', component: ProjectDetailComponent},
    { path: 'login', component: LoginComponent},
    { path: 'writing-space', component: WritingSpaceComponent},
];
