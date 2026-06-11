import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { response } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData = { username: '', passwordHash: '' };
  loginError: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    this.loginError = false;

    const loginPayload = {
      Username: this.loginData.username,
      PasswordHash: this.loginData.passwordHash,
      Email: '',
      OwnedProjects: [],
    };

    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        console.log('Resposta real da API:', response);

        if (response && response.userId) {
          this.authService.saveUserData(response);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('A API não enviou o userId esperado:', response);
        }
      },
      error: (err: any) => {
        if (err.status === 200 || err.status === 201) {
          const realData = err.error;
          if (realData && realData.userId) {
            this.authService.saveUserData(realData);
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.loginError = true;
          console.error('Erro real no login:', err);
          alert('Credenciais inválidas.');
        }
      },
    });
  }
}
