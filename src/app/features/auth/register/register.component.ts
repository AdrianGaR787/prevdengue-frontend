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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, RouterModule, MatSnackBarModule,RouterModule,MatOptionModule,MatSelectModule,MatFormFieldModule,MatProgressSpinnerModule,MatIconModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = false;
  confirmPassword = '';

  user: any = {
    name: '',
    email: '',
    passwordHash: '', 
    phone: '',
    role: { idRole: 2 }, //2 significa Ciudadano segun nuestros roles, cada usuario que se registre tendra automaticamente el rol "2" - Ciudadano
    preferredLanguage: '',
  };

  onRegister() {
    this.user.name = this.user.name?.trim();
      this.user.email = this.user.email?.trim().toLowerCase();
      this.user.phone = this.user.phone?.trim();
      this.loading = true;
      

    this.userService.register(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.', 'Cerrar', { duration: 4000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.loading = false;
        const msg = (err?.status === 409 || err?.status === 500)
          ? 'Ese correo electrónico o teléfono ya está registrado. Intenta con otro o inicia sesión.'
          : 'No se pudo crear la cuenta. Verifica tu conexión e intenta nuevamente.';
        this.snackBar.open(msg, 'Cerrar', { duration: 5000, panelClass: ['mat-warn'] });
}
    });
  }
}
