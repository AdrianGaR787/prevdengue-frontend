import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.services';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule, RouterModule, MatIcon,
  ],
  templateUrl: './user-insert.html',
  styleUrls: ['./user-insert.css']
})
export class UserInsert implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  // Roles fijos para el mat-select (ajusta los IDs según tu base de datos)
  roles = [
    { idRole: 1, nameRole: 'ADMIN' },
    { idRole: 2, nameRole: 'CIUDADANO' },
    { idRole: 3, nameRole: 'BRIGADISTA' }
  ];

  user: any = {
    idUser: 0,
    name: '',
    email: '',
    phone: '',
    passwordHash: '', 
    role: { idRole: 2 } // Por defecto CIUDADANO
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      const idUserToEdit = +idParam;
      
      this.userService.getById(idUserToEdit).subscribe({
        next: (data) => {
          // 1. 🔍 REVISIÓN EN CONSOLA: Abre las herramientas de desarrollador (F12) 
          // y mira exactamente qué nombres de campos están viniendo del backend.
          console.log("Datos del usuario recibidos:", data); 
          
          this.user = data;
          
          // 2. 🛡️ ESCUDO PROTECTOR PARA EL ROL:
          // Si el backend no envía el objeto 'role' o viene nulo, lo inicializamos
          if (!this.user.role) {
            this.user.role = { idRole: 2 }; 
          } else if (typeof this.user.role === 'object' && this.user.role !== null) {
            // Si viene el objeto pero por alguna razón el campo se llama id en vez de idRole
            // Aseguramos que exista idRole para que el mat-select sepa qué marcar
            this.user.role.idRole = data.role.idRole || data.role.id || 2;
          }
        },
        error: (err) => {
          console.error('Error al obtener usuario para edición:', err);
        }
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.userService.update(this.user).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.userService.insert(this.user).subscribe({
        next: () => {
          this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}