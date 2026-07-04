import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { DistrictService } from '../../../core/services/district';

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './district-list.html'
})
export class DistrictLisst implements OnInit {
  private districtService = inject(DistrictService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadDistricts();
  }

  loadDistricts() {
    this.districtService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error al cargar distritos:', err)
    });
  }

  deleteDistrict(id: number) {
    if (confirm('¿Eliminar este distrito de forma permanente?')) {
      this.districtService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Distrito eliminado', 'Cerrar', { duration: 3000 });
          this.loadDistricts();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    }
  }
}