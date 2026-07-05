import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.services';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {

  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allUsers: any[] = []; // Copia de seguridad intocable
  users: any[] = [];    // Usuarios filtrados y ordenados
  pagedUsers: any[] = []; // Tarjetas que se muestran en la página actual

  pageSize = 6;
  pageIndex = 0;

  // 🚀 VARIABLES PARA EL FILTRO Y ORDENAMIENTO
  selectedRole: string = 'TODOS';
  roleWeights: { [key: string]: number } = {
    'ADMIN': 1,
    'BRIGADISTA': 2,
    'CIUDADANO': 3
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applyFilterAndSort(); // Aplicamos la magia al cargar
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // 🚀 LÓGICA DE FILTRADO Y ORDENAMIENTO
  applyFilterAndSort() {
    // 1. Filtrar por el rol seleccionado
    let filtered = this.allUsers;
    if (this.selectedRole !== 'TODOS') {
      filtered = this.allUsers.filter(u => u.role?.nameRole === this.selectedRole);
    }

    // 2. Ordenar por jerarquía (Admin -> Brigadista -> Ciudadano)
    this.users = filtered.sort((a, b) => {
      const weightA = this.roleWeights[a.role?.nameRole] || 99; // Si no tiene rol, va al final (99)
      const weightB = this.roleWeights[b.role?.nameRole] || 99;
      return weightA - weightB;
    });

    // 3. Reiniciar a la página 1 y cortar el arreglo para mostrar
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.updatePagedData();
  }

  // Se ejecuta cuando el Admin cambia el desplegable
  onRoleFilterChange() {
    this.applyFilterAndSort();
  }

  updatePagedData() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.users.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedData();
  }

  deleteUser(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar usuario',
        message: '¿Estás seguro de que deseas eliminar a este usuario? Esta acción es irreversible.',
        danger: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.userService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar. Verifica que el usuario no tenga reportes asociados.', 'Cerrar', { duration: 4000 });
        }
      });
    });
  }
}