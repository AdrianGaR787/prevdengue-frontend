import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportService } from '../../../core/services/report';
import { ReportDTO } from '../../../core/models/Report';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, DatePipe, RouterModule],
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportListComponent implements OnInit {
  // Las columnas que mostraremos en la tabla
  displayedColumns: string[] = ['id', 'user', 'hatchery', 'status', 'date', 'district','symptoms', 'description', 'actions'];
  reports: ReportDTO[] = [];

  private reportService = inject(ReportService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports() {
    this.reportService.list().subscribe({
      next: (data) => {
        this.reports = data;
        console.log('Reportes cargados:', data);
      },
      error: (err) => console.error('Error al cargar reportes', err)
    });
  }
  deleteReport(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
      this.reportService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Reporte eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadReports(); // Refresca la tabla automáticamente
        },
        error: (err) => console.error('Error al eliminar el reporte:', err)
      });
    }
  }
}