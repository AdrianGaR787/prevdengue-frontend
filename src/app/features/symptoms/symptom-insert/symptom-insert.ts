import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SymptomService } from '../../../core/services/symptom';

@Component({
  selector: 'app-symptom-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './symptom-insert.html'
})
export class SymptomInsertComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  symptom: any = {
    idSymptom: 0,
    nameSymptom: '',
    gravitylevel: 1 // Nivel de gravedad por defecto
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.symptomService.getById(+idParam).subscribe({
        next: (data) => this.symptom = data,
        error: (err) => console.error('Error al obtener síntoma:', err)
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.symptomService.update(this.symptom).subscribe({
        next: () => {
          this.snackBar.open('Síntoma actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/sintomas']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.symptomService.insert(this.symptom).subscribe({
        next: () => {
          this.snackBar.open('Síntoma registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/sintomas']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}