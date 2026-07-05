import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Servicios
import { UserService } from '../../../core/services/user.services';
import { RoleService } from '../../../core/services/role';

@Component({
  selector: 'app-user-insert',
  standalone: true,
  // Asegúrate de importar MatSelectModule, MatCheckboxModule y MatIconModule
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, 
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './user-insert.html',
  styleUrls: ['./user-insert.css'] // Si no tienes css, puedes borrar esta línea
})
export class UserInsert implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService); // Para cargar la lista de roles
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  loading: boolean = false;
  saving: boolean = false;
  roles: any[] = [];
  
  // 🚀 INICIALIZACIÓN SEGURA DE VARIABLES
  user: any = {
    idUser: 0,
    name: '',
    email: '',
    phone: '',
    passwordHash: '',
    preferredLanguage: 'ES',     // Valor por defecto
    accumulatedPoints: 0,        // Comienza con 0 puntos
    biometricsActive: false,     // Biometría apagada por defecto
    role: { idRole: null }       // Para enlazar con el mat-select
  };

  ngOnInit() {
    // 1. Cargar roles disponibles de la BD
    this.roleService.list().subscribe({
      next: (data) => this.roles = data,
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.snackBar.open('No se pudieron cargar los roles disponibles.', 'Cerrar', { duration: 4000 });
      }
    });

    // 2. Revisar si es modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.userService.getById(+idParam).subscribe({
        next: (data) => {
          this.user = data;
          
          // Prevención de errores si vienen datos nulos del backend
          if (!this.user.role) this.user.role = { idRole: null };
          if (this.user.biometricsActive === undefined) this.user.biometricsActive = false;
          if (!this.user.accumulatedPoints) this.user.accumulatedPoints = 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener usuario para edición:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el usuario.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/usuarios']);
        }
      });
    }
  }

  onSave() {
    this.user.name = this.user.name?.trim();
    this.user.email = this.user.email?.trim().toLowerCase();
    this.user.phone = this.user.phone?.trim();
    this.saving = true;

    if (this.isEditMode) {
      this.userService.update(this.user).subscribe({
        next: () => {
          this.snackBar.open('¡Usuario actualizado con éxito!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.saving = false;
          this.snackBar.open('Error al actualizar. Verifica que el correo o teléfono no estén duplicados.', 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.userService.insert(this.user).subscribe({
        next: () => {
          this.snackBar.open('¡Usuario creado correctamente!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.saving = false;
          this.snackBar.open('Error al crear. Verifica que el correo o teléfono no estén duplicados.', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}