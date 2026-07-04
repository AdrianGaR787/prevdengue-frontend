import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.services';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {

  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  users: any[] = [];
  pagedUsers: any[] = [];

  pageSize = 6;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.list().subscribe({
      next: (data) => {
        this.users = data;
        this.updatePagedData();
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
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
    if (confirm('⚠️ ¿Estás seguro de que deseas eliminar a este usuario? Esta acción es irreversible.')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.snackBar.open(
            'Usuario eliminado correctamente',
            'Cerrar',
            { duration: 3000 }
          );

          this.loadUsers();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);

          this.snackBar.open(
            'Error al eliminar. Verifica que el usuario no tenga reportes asociados.',
            'Cerrar',
            { duration: 4000 }
          );
        }
      });
    }
  }
}