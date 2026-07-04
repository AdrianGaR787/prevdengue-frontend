import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HatcheryTypeService } from '../../../core/services/hatchery-type';

@Component({
  selector: 'app-hatchery-type-insert',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, RouterModule],
  templateUrl: './hatchery-type-insert.html'
})
export class HatcheryTypeInsertComponent implements OnInit {
  private hatcheryTypeService = inject(HatcheryTypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  isEditMode: boolean = false;
  
  hatcheryType: any = {
    idHatcheryType: 0,
    nameHatchery: ''
  };

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.hatcheryTypeService.getById(+idParam).subscribe({
        next: (data) => this.hatcheryType = data,
        error: (err) => console.error('Error al obtener tipo de criadero:', err)
      });
    }
  }

  onSave() {
    if (this.isEditMode) {
      this.hatcheryTypeService.update(this.hatcheryType).subscribe({
        next: () => {
          this.snackBar.open('Tipo de criadero actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/criaderos']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.hatcheryTypeService.insert(this.hatcheryType).subscribe({
        next: () => {
          this.snackBar.open('Tipo de criadero registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/criaderos']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }
}