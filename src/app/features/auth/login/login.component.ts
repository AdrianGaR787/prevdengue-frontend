import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.services';
import { JwtRequestDTO } from '../../../core/models/Auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials: JwtRequestDTO = { username: '', password: '' };
  errorMessage: string = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        // El interceptor y el guard ya hacen su trabajo, solo redirigimos
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas o usuario no encontrado.';
        console.error(err);
      }
    });
  }
}