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
import { DistrictService } from '../../../core/services/district';

@Component({
  selector: 'app-district-insert',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, RouterModule
  ],
  templateUrl: './district-insert.html'
})
export class DistricInsert implements OnInit {
  private districtService = inject(DistrictService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode = false;
  loading = false;
  saving = false;

  district: any = {
    idDistrict: 0,
    nameDistrict: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.loading = true;
      this.districtService.getById(+idParam).subscribe({
        next: (data) => { this.district = data; this.loading = false; },
        error: (err) => {
          console.error('Error al obtener distrito:', err);
          this.loading = false;
          this.snackBar.open('No se pudo cargar el distrito. Intenta nuevamente.', 'Cerrar', { duration: 4000 });
          this.router.navigate(['/dashboard/distritos']);
        }
      });
    }
  }

  onSave() {
    // Normalizamos espacios extra que el usuario pudo haber dejado sin querer
    this.district.nameDistrict = this.district.nameDistrict?.trim();
    this.saving = true;

    const request = this.isEditMode
      ? this.districtService.update(this.district)
      : this.districtService.insert(this.district);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode ? 'Distrito actualizado correctamente' : 'Distrito registrado correctamente',
          'Cerrar', { duration: 3000 }
        );
        this.router.navigate(['/dashboard/distritos']);
      },
      error: (err) => {
        console.error('Error al guardar distrito:', err);
        this.saving = false;
        const msg = err?.status === 409 || err?.status === 500
          ? 'Ya existe un distrito con ese nombre. Verifica e intenta de nuevo.'
          : 'No se pudo guardar el distrito. Verifica tu conexión e intenta nuevamente.';
        this.snackBar.open(msg, 'Cerrar', { duration: 4500 });
      }
    });
  }
}
