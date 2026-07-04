import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../../core/services/role';

@Component({
  selector: 'app-role-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './role-insert.html'
})
export class RoleInsertComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  role: any = {
    idRole: 0,
    nameRole: '',
    description: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.roleService.getById(+idParam).subscribe({
        next: (data) => this.role = data,
        error: (err) => console.error('Error al obtener rol:', err)
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.roleService.update(this.role).subscribe({
        next: () => {
          this.snackBar.open('Rol actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/roles']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.roleService.insert(this.role).subscribe({
        next: () => {
          this.snackBar.open('Rol registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/roles']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}