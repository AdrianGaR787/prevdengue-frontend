import { Component, inject , OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReportService } from '../../../core/services/report';
import { DistrictService } from '../../../core/services/district';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SymptomService } from '../../../core/services/symptom';
import { AuthService } from '../../../core/services/auth.services';
import { UserService } from '../../../core/services/user.services';

@Component({
  selector: 'app-report-insert',
  standalone: true,
  imports: [
    FormsModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule,RouterModule,MatSnackBarModule
  ],
  templateUrl: './report-insert.html',
  styleUrls: ['./report-insert.css']
})
export class ReportInsertComponent implements OnInit {
  private reportService = inject(ReportService);
  private router = inject(Router);
  private districtService = inject(DistrictService);
  private snackBar = inject(MatSnackBar);
  private symptomService = inject(SymptomService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  distritos: any[] = [];
  sintomas: any[] = []; // <-- Lista que viene de la BD
  selectedSymptoms: number[] = [];
  isEditMode: boolean = false;
  idReportToEdit!: number;
  currentUserId: number | null = null; // ID real del usuario logueado (se resuelve en ngOnInit)
  

ngOnInit() {
  this.districtService.list().subscribe(data => this.distritos = data);
  this.symptomService.list().subscribe(data => this.sintomas = data);

  // 🔧 Resolvemos el usuario REAL logueado a partir del JWT (antes estaba fijo en idUser: 2)
  const email = this.authService.getEmail();
  if (email) {
    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        this.currentUserId = user.idUser;
        // Solo pisamos el usuario del reporte si estamos CREANDO uno nuevo.
        // En modo edición, el usuario del reporte ya viene del backend (getById) y no debe cambiar.
        if (!this.isEditMode) {
          this.report.user = { idUser: this.currentUserId };
        }
      },
      error: (err) => console.error('Error al obtener el usuario logueado', err)
    });
  }

  // 2. DETECTAR MODO EDICIÓN: ¿Viene un ID en la URL?
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.idReportToEdit = +idParam; // El signo '+' convierte el string a número
      
      // Obtener los datos del reporte desde el backend
      this.reportService.getById(this.idReportToEdit).subscribe({
        next: (data) => {
          this.report = data;
          
          this.report.anonymous = data.anonymous;
          // Mapear los síntomas que ya tenía guardados para que aparezcan seleccionados en el mat-select
          if (data.symptoms) {
            this.selectedSymptoms = data.symptoms.map((s: any) => s.idSymptom);
          }
        },
        error: (err) => console.error('Error al obtener el reporte para edición', err)
      });
    }
}
  // Armamos el payload con la estructura exacta de tu backend
  report: any = {
    idReport: 0,
    description: '',
    latitude: -12.04318, 
    longitude: -77.02824, 
    anonymous: false,
    reportDate: new Date().toISOString().split('.')[0], // Formato compatible con LocalDateTime
    user: { idUser: 0 }, // Se sobreescribe en ngOnInit con el usuario realmente logueado
    hatcheryType: { idHatcheryType: 1 }, // 1 = Llantas, Baldes, etc. (ajusta según tu BD)
    status: { idStatus: 1 }, // 1 = Pendiente
    symptoms: [] ,
    district: { idDistrict: 1 } // Deja el distrito vacío por ahora, lo seleccionará el usuario
  };


  onSave() {
    if (!this.isEditMode && !this.report.user?.idUser) {
      this.snackBar.open('No se pudo identificar al usuario logueado. Intenta recargar la página.', 'Cerrar', { duration: 4000 });
      return;
    }
    this.report.symptoms = this.selectedSymptoms.map(id => ({ idSymptom: id }));
    if (this.isEditMode) {
      // 🛠️ MODO EDICIÓN: Llamamos a update
      this.reportService.update(this.report).subscribe({
        next: () => {
          this.snackBar.open('¡Reporte actualizado con éxito!', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard/reportes']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.reportService.insert(this.report).subscribe({
      next: (data) => {
        // 1. Mostrar notificación de éxito
        this.snackBar.open('¡Reporte registrado con éxito!', 'Cerrar', {
          duration: 3000, // Se cierra solo después de 3 segundos
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'] // Opcional: para darle estilos CSS luego
        });

        // 2. Redirigir al listado de reportes
        this.router.navigate(['/dashboard/reportes']);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        // Mostrar notificación de error
        this.snackBar.open('Ocurrió un error al registrar el reporte', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
}