import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { WritingSpaceComponent } from './pages/writing-space/writing-space.component';


export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'project/:id', component: ProjectDetailsComponent},
    {path: 'write/:projectId/:chapterId', component: WritingSpaceComponent},
    {path: '**', redirectTo: 'login'}
];
