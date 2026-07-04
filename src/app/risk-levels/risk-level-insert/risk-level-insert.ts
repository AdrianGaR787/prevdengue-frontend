import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RiskLevelService } from '../../../core/services/risk-level';

@Component({
  selector: 'app-risk-level-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './risk-level-insert.html'
})
export class RiskLevelInsertComponent implements OnInit {
  private riskLevelService = inject(RiskLevelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  riskLevel: any = {
    idRiskLevel: 0,
    nameRiskLevel: '',
    colorRiskLevel: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.riskLevelService.getById(+idParam).subscribe({
        next: (data) => this.riskLevel = data,
        error: (err) => console.error('Error al obtener nivel de riesgo:', err)
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.riskLevelService.update(this.riskLevel).subscribe({
        next: () => {
          this.snackBar.open('Nivel de riesgo actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/niveles-riesgo']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.riskLevelService.insert(this.riskLevel).subscribe({
        next: () => {
          this.snackBar.open('Nivel de riesgo registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/niveles-riesgo']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}