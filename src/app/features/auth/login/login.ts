import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, 
    MatInputModule, 
    MatIconModule, 
    MatCardModule, 
    FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private authService = inject(AuthService);

  credentials = {
    username: '',
    password: ''
  };
  
  errorMessage: string = '';

  // Y el método que el HTML llama
  login() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // Aquí rediriges al usuario o guardas el token
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }
}
