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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    console.log('ao menos ta a tentar :D', this.loginData);

    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('Sucesso', response);
        this.authService.saveUserData(response);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('erro no login:', err);
        alert(
          'Erro no login: ' +
            (err.error?.message || 'Credenciais inválidas ou erro de ligação à API.'),
        );
      },
    });
  }
}
