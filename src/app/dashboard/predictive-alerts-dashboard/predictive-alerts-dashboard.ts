import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PredictiveAlertService } from '../../../core/services/predictive-alert.services';
import { PredictiveAlertDTO } from '../../../core/models/predictive-alert';

@Component({
  selector: 'app-predictive-alerts-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, DatePipe],
  templateUrl: './predictive-alerts-dashboard.html'
})
export class PredictiveAlertsDashboardComponent implements OnInit {
  private alertService = inject(PredictiveAlertService);
  
  alertas: PredictiveAlertDTO[] = [];
  alertasActivas: PredictiveAlertDTO[] = [];

  ngOnInit() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.alertService.getAllAlerts().subscribe({
      next: (data) => {
        // 🚀 LÓGICA DE BI: Ordenamos priorizando el riesgo (Alto > Medio > Bajo)
        this.alertas = data.sort((a, b) => b.riskLevel.idRiskLevel - a.riskLevel.idRiskLevel);
        
        // Filtramos para contar cuántas alertas reales hay (Medio y Alto)
        this.alertasActivas = this.alertas.filter(a => a.riskLevel.idRiskLevel > 1);
      },
      error: (err) => console.error('Error al cargar alertas', err)
    });
  }

  // Utilidad visual para pintar las tarjetas según la gravedad
  getColorPorRiesgo(idRiesgo: number): string {
    switch (idRiesgo) {
      case 3: return '#d32f2f'; // ROJO (Alto)
      case 2: return '#ed6c02'; // NARANJA (Medio)
      case 1: return '#2e7d32'; // VERDE (Bajo)
      default: return '#757575';
    }
  }

  getIconoPorRiesgo(idRiesgo: number): string {
    switch (idRiesgo) {
      case 3: return 'warning'; 
      case 2: return 'trending_up';
      case 1: return 'verified_user';
      default: return 'info';
    }
  }
}