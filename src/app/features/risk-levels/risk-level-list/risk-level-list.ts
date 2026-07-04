import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { RiskLevelService } from '../../../core/services/risk-level';

@Component({
  selector: 'app-risk-level-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterModule],
  templateUrl: './risk-level-list.html'
})
export class RiskLevelListComponent implements OnInit {
  private riskLevelService = inject(RiskLevelService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'name', 'color', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadRiskLevels();
  }

  loadRiskLevels() {
    this.riskLevelService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => console.error('Error al cargar niveles:', err)
    });
  }

  deleteRiskLevel(id: number) {
    if (confirm('¿Eliminar este nivel de riesgo permanentemente?')) {
      this.riskLevelService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Nivel de riesgo eliminado', 'Cerrar', { duration: 3000 });
          this.loadRiskLevels();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    }
  }
}