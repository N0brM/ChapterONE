import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      return;
    }

    console.log('A tentar registar', this.registerData);

    this.authService
      .register({
        Username: this.registerData.username,
        Email: this.registerData.email,
        PasswordHash: this.registerData.password,
        OwnedProjects: [],
      })
      .subscribe({
        next: (response: any) => {
          console.log('Registo efetuado com sucesso', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro Recebido:', err);

          if (err.status === 200 || err.status === 201) {
            this.router.navigate(['/login']);
          } else {
            return;
          }
        },
      });
  }
}
