import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RiskLevelService } from '../../../core/services/risk-level';

@Component({
  selector: 'app-risk-level-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './risk-level-insert.html'
})
export class RiskLevelInsertComponent implements OnInit {
  private riskLevelService = inject(RiskLevelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  loading = false;
  saving = false;

  // 🎨 Colores predefinidos: evita errores de tipeo y mantiene consistencia visual con el resto del sistema
  colorOptions = [
    { value: 'Verde', hex: '#22C55E' },
    { value: 'Amarillo', hex: '#FACC15' },
    { value: 'Naranja', hex: '#FB923C' },
    { value: 'Rojo', hex: '#EF4444' }
  ];

  riskLevel: any = {
    idRiskLevel: 0,
    nameRiskLevel: '',
    colorRiskLevel: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.riskLevelService.getById(+idParam).subscribe({
        next: (data) => { this.riskLevel = data; this.loading = false; },
        error: (err) => {
          console.error('Error al obtener nivel de riesgo:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el nivel de riesgo.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/niveles-riesgo']);
        }
      });
    }
  }

  onSave() {
    this.riskLevel.nameRiskLevel = this.riskLevel.nameRiskLevel?.trim();
    this.saving = true;

    const request = this.isEditMode
      ? this.riskLevelService.update(this.riskLevel)
      : this.riskLevelService.insert(this.riskLevel);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode ? 'Nivel de riesgo actualizado' : 'Nivel de riesgo registrado',
          'Cerrar', { duration: 3000 }
        );
        this.router.navigate(['/dashboard/niveles-riesgo']);
      },
      error: (err) => {
        console.error('Error al guardar nivel de riesgo:', err);
        this.saving = false;
        this.snackBar.open('No se pudo guardar. Verifica tu conexión e intenta nuevamente.', 'Cerrar', { duration: 4500 });
      }
    });
  }
}
