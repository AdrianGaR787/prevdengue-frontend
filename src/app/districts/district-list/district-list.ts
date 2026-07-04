import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DistrictService } from '../../../core/services/district';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule, RouterModule],
  templateUrl: './district-list.html'
})
export class DistrictLisst implements OnInit {
  private districtService = inject(DistrictService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  loading = false;

  ngOnInit() {
    this.loadDistricts();
  }

  loadDistricts() {
    this.loading = true;
    this.districtService.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: (err) => {
        console.error('Error al cargar distritos:', err);
        this.loading = false;
        this.snackBar.open('No se pudieron cargar los distritos. Verifica tu conexión.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteDistrict(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar distrito',
        message: '¿Eliminar este distrito de forma permanente? Esta acción no se puede deshacer.',
        danger: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.districtService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Distrito eliminado', 'Cerrar', { duration: 3000 });
          this.loadDistricts();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso por otros registros.', 'Cerrar', { duration: 4000 })
      });
    });
  }
}