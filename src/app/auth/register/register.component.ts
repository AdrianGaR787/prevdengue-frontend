import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.services';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, RouterModule, MatSnackBarModule,RouterModule,MatOptionModule,MatSelectModule,MatFormFieldModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  user: any = {
    name: '',
    email: '',
    passwordHash: '', 
    phone: '',
    role: { idRole: 2 }, //2 significa Ciudadano segun nuestros roles, cada usuario que se registre tendra automaticamente el rol "2" - Ciudadano
    preferredLanguage: '',
  };

  onRegister() {
    this.userService.register(this.user).subscribe({
      next: () => {
        this.snackBar.open('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        // Si el backend falla por duplicidad (HTTP 500 o 409)
        this.snackBar.open('Error: El correo electrónico o teléfono ya está registrado.', 'Cerrar', { duration: 5000, panelClass: ['mat-warn'] });
      }
    });
  }
}
