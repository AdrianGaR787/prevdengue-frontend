import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../../core/services/role';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, RouterModule],
  templateUrl: './role-list.html'
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.snackBar.open('No se pudieron cargar los roles.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteRole(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar rol', message: '¿Eliminar este rol de forma permanente?', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.roleService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Rol eliminado', 'Cerrar', { duration: 3000 });
          this.loadRoles();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    });
  }
}