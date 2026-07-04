import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DistrictService } from '../../../core/services/district';

@Component({
  selector: 'app-district-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './district-insert.html'
})
export class DistricInsert implements OnInit {
  private districtService = inject(DistrictService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  district: any = {
    idDistrict: 0,
    nameDistrict: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.districtService.getById(+idParam).subscribe({
        next: (data) => this.district = data,
        error: (err) => console.error('Error al obtener distrito:', err)
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.districtService.update(this.district).subscribe({
        next: () => {
          this.snackBar.open('Distrito actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/distritos']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.districtService.insert(this.district).subscribe({
        next: () => {
          this.snackBar.open('Distrito registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/distritos']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}