import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { SymptomService } from '../../../core/services/symptom';

@Component({
  selector: 'app-symptom-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './symptom-list.html'
})
export class SymptomListComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'gravity', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadSymptoms();
  }

  loadSymptoms() {
    this.symptomService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error al cargar síntomas:', err)
    });
  }

  deleteSymptom(id: number) {
    if (confirm('¿Eliminar este síntoma de forma permanente?')) {
      this.symptomService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Síntoma eliminado', 'Cerrar', { duration: 3000 });
          this.loadSymptoms();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    }
  }
}