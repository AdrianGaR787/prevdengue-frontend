import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReportService } from '../../../core/services/report';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css']
})
export class DashboardHomeComponent implements OnInit {
  private reportService = inject(ReportService);

  distritosStats: any[] = [];
  criaderosStats: any[] = [];
  estadosStats: any[] = [];
  reportesCriticos: any[] = [];

  ngOnInit() {
    this.loadAnalytics();
    }

  loadAnalytics() {
    // 1. Ranking de Distritos
    this.reportService.getDistrictRanking().subscribe(data => {
      this.distritosStats = this.mapDataForBars(data);
    });

    // 2. Tipos de Criaderos
    this.reportService.getHatcheryRanking().subscribe(data => {
      this.criaderosStats = this.mapDataForBars(data);
    });

    // 3. Estados de Reportes
    this.reportService.getStatusRanking().subscribe(data => {
      this.estadosStats = this.mapDataForBars(data);
    });

    // 4. Reportes con más síntomas (Vienen como DTO, no como String[])
    this.reportService.getReportsWithMostSymptoms().subscribe(data => {
      // Solo tomamos los top 5 más críticos
      this.reportesCriticos = data.slice(0, 5); 
    });
  }

  // 🛠️ Función mágica: Convierte [ "Nombre", "10" ] a un objeto con porcentaje para CSS
  private mapDataForBars(data: any[]): any[] {
    if (!data || data.length === 0) return [];
    
    // Mapeamos el arreglo
    const mapped = data.map(item => ({ name: item[0], count: Number(item[1]) }));
    
    // Encontramos el valor máximo para que esa barra mida el 100% de ancho
    const maxCount = Math.max(...mapped.map(i => i.count));
    
    // Calculamos el porcentaje de cada uno respecto al máximo
    return mapped.map(item => ({
      ...item,
      percent: maxCount > 0 ? (item.count / maxCount) * 100 : 0
    }));
  }
}