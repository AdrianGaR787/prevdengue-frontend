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
import { SymptomService } from '../../../core/services/symptom';

@Component({
  selector: 'app-symptom-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './symptom-insert.html'
})
export class SymptomInsertComponent implements OnInit {
  private symptomService = inject(SymptomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  loading = false;
  saving = false;

  // 🌡️ Escala de gravedad con etiquetas descriptivas, para que no se ingresen números "a ciegas"
  gravityOptions = [
    { value: 1, label: '1 - Leve' },
    { value: 2, label: '2 - Moderado' },
    { value: 3, label: '3 - Considerable' },
    { value: 4, label: '4 - Grave' },
    { value: 5, label: '5 - Muy grave' }
  ];

  symptom: any = {
    idSymptom: 0,
    nameSymptom: '',
    gravitylevel: 1
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.symptomService.getById(+idParam).subscribe({
        next: (data) => { this.symptom = data; this.loading = false; },
        error: (err) => {
          console.error('Error al obtener síntoma:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el síntoma.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/sintomas']);
        }
      });
    }
  }

  onSave() {
    this.symptom.nameSymptom = this.symptom.nameSymptom?.trim();
    this.saving = true;

    const request = this.isEditMode
      ? this.symptomService.update(this.symptom)
      : this.symptomService.insert(this.symptom);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode ? 'Síntoma actualizado' : 'Síntoma registrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/dashboard/sintomas']);
      },
      error: (err) => {
        console.error('Error al guardar síntoma:', err);
        this.saving = false;
        this.snackBar.open('No se pudo guardar. Verifica tu conexión e intenta nuevamente.', 'Cerrar', { duration: 4500 });
      }
    });
  }
}
