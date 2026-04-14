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
    console.log('ao menos ta a tentar :D', this.loginData);

    const loginPayload = 
    {
      Username: this.loginData.username,
      PasswordHash: this.loginData.passwordHash,
      Email: "default@email.com",
      OwnedProjects: []
    };

    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        console.log('Sucesso', response);
        this.authService.saveUserData({
          userId: '1',
          username: this.loginData.username
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loginError = true;
        console.error('erro no login:', err);

        if (err.status === 200 || err.status === 201) {
          console.log('Login bem-sucedido');
          this.authService.saveUserData({ 
            userId: '1', 
            username: this.loginData.username 
          });
          this.router.navigate(['/dashboard']);
        }
        else
        {
          this.loginError = true;
          console.error('Erro real no login:', err);
          alert('Credenciais inválidas.');
        }
      },
    });
  }
}
