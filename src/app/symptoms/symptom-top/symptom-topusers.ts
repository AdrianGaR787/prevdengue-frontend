import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SymptomService } from '../../../core/services/symptom';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-symptom-topusers',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './symptom-topusers.html',
  styleUrls: ['./symptom-topusers.css']
})
export class SymptomTopUsersComponent implements OnInit {
  private symptomService = inject(SymptomService);

  sintomasStats: any[] = [];

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    // 🚀 Llama directo a los síntomas sin anidar
    this.symptomService.getMostFrequentSymptoms().subscribe({
      next: (data) => {
        this.sintomasStats = this.mapDataForBars(data);
      },
      error: (err) => console.error('Error al cargar analítica de síntomas:', err)
    });
  }

  // 🛠️ Función matemática para calcular el ancho de las barras (%)
  // 🛠️ Función matemática corregida para leer los alias de tu SQL
  private mapDataForBars(data: any[]): any[] {
    if (!data || data.length === 0) return [];
    
    // 🚀 Leemos 'item.sintoma' y 'item.cantidad' basados en el AS de tu query
    const mapped = data.map(item => ({ 
      name: item.sintoma || item[0] || 'Desconocido', 
      count: Number(item.cantidad || item[1] || 0) 
    }));
    
    const maxCount = Math.max(...mapped.map(i => i.count));
    
    return mapped.map(item => ({
      ...item,
      percent: maxCount > 0 ? (item.count / maxCount) * 100 : 0
    }));
  }
}