import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RiskLevelService } from '../../../core/services/risk-level';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-risk-level-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule, RouterModule],
  templateUrl: './risk-level-list.html'
})
export class RiskLevelListComponent implements OnInit {
  private riskLevelService = inject(RiskLevelService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'name', 'color', 'actions'];
  dataSource = new MatTableDataSource<any>();

  ngOnInit() {
    this.loadRiskLevels();
  }

  loadRiskLevels() {
    this.riskLevelService.list().subscribe({
      next: (data) => this.dataSource.data = data,
      error: (err) => {
        console.error('Error al cargar niveles:', err);
        this.snackBar.open('No se pudieron cargar los niveles de riesgo.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  deleteRiskLevel(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar nivel de riesgo', message: '¿Eliminar este nivel de riesgo permanentemente?', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.riskLevelService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Nivel de riesgo eliminado', 'Cerrar', { duration: 3000 });
          this.loadRiskLevels();
        },
        error: (err) => this.snackBar.open('Error al eliminar. Puede estar en uso.', 'Cerrar', { duration: 4000 })
      });
    });
  }
}