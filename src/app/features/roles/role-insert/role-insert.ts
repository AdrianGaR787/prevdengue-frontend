import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../core/services/role';

@Component({
  selector: 'app-role-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './role-insert.html'
})
export class RoleInsertComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  loading = false;
  saving = false;

  role: any = {
    idRole: 0,
    nameRole: '',
    description: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.roleService.getById(+idParam).subscribe({
        next: (data) => { this.role = data; this.loading = false; },
        error: (err) => {
          console.error('Error al obtener rol:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el rol.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/roles']);
        }
      });
    }
  }

  onSave() {
    this.role.nameRole = this.role.nameRole?.trim().toUpperCase();
    this.role.description = this.role.description?.trim();
    this.saving = true;

    const request = this.isEditMode
      ? this.roleService.update(this.role)
      : this.roleService.insert(this.role);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode ? 'Rol actualizado' : 'Rol registrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard/roles']);
      },
      error: (err) => {
        console.error('Error al guardar rol:', err);
        this.saving = false;
        this.snackBar.open('No se pudo guardar. Verifica tu conexión e intenta nuevamente.', 'Cerrar', { duration: 4500 });
      }
    });
  }
}
