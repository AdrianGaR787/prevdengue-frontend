import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { HatcheryTypeService } from '../../../core/services/hatchery-type';

@Component({
  selector: 'app-hatchery-type-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './hatchery-type-list.html'
})
export class HatcheryTypeListComponent implements OnInit {
  private hatcheryTypeService = inject(HatcheryTypeService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadHatcheryTypes();
  }

  loadHatcheryTypes() {
    this.hatcheryTypeService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error al cargar criaderos:', err)
    });
  }

  deleteHatcheryType(id: number) {
    if (confirm('¿Eliminar este tipo de criadero de forma permanente?')) {
      this.hatcheryTypeService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Tipo de criadero eliminado', 'Cerrar', { duration: 3000 });
          this.loadHatcheryTypes();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    }
  }
}