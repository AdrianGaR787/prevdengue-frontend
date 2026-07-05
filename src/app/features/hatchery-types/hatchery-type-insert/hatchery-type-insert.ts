import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HatcheryTypeService } from '../../../core/services/hatchery-type';

@Component({
  selector: 'app-hatchery-type-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './hatchery-type-insert.html'
})
export class HatcheryTypeInsertComponent implements OnInit {
  private hatcheryTypeService = inject(HatcheryTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  loading = false;
  saving = false;

  hatcheryType: any = {
    idHatcheryType: 0,
    nameHatchery: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.hatcheryTypeService.getById(+idParam).subscribe({
        next: (data) => { this.hatcheryType = data; this.loading = false; },
        error: (err) => {
          console.error('Error al obtener tipo de criadero:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el tipo de criadero.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/criaderos']);
        }
      });
    }
  }

  onSave() {
    this.hatcheryType.nameHatchery = this.hatcheryType.nameHatchery?.trim();
    this.saving = true;

    const request = this.isEditMode
      ? this.hatcheryTypeService.update(this.hatcheryType)
      : this.hatcheryTypeService.insert(this.hatcheryType);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode ? 'Tipo de criadero actualizado' : 'Tipo de criadero registrado',
          'Cerrar', { duration: 3000 }
        );
        this.router.navigate(['/dashboard/criaderos']);
      },
      error: (err) => {
        console.error('Error al guardar tipo de criadero:', err);
        this.saving = false;
        this.snackBar.open('No se pudo guardar. Verifica tu conexión e intenta nuevamente.', 'Cerrar', { duration: 4500 });
      }
    });
  }
}
