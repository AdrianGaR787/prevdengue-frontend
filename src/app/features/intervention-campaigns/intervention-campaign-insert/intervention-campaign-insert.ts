import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';       
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InterventionCampaignService } from '../../../core/services/intervention-campaign-service'; 
import { DistrictService } from '../../../core/services/district'; 
import { DistrictDTO } from '../../../core/models/intervention-campaign';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

// 📅 Validador de grupo: verifica que fecha/hora de fin sea posterior a fecha/hora de inicio
function endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
  const startDate = group.get('fechaInicioDate')?.value;
  const startTime = group.get('fechaInicioTime')?.value;
  const endDate = group.get('fechaFinDate')?.value;
  const endTime = group.get('fechaFinTime')?.value;
  if (!startDate || !endDate || !startTime || !endTime) return null;

  const start = new Date(startDate);
  const [sh, sm] = startTime.split(':').map(Number);
  start.setHours(sh, sm, 0, 0);

  const end = new Date(endDate);
  const [eh, em] = endTime.split(':').map(Number);
  end.setHours(eh, em, 0, 0);

  return end.getTime() > start.getTime() ? null : { endBeforeStart: true };
}

@Component({
  selector: 'app-intervention-campaign-insert',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title style="color: var(--primary-dark); font-weight: bold;">Registrar Campaña Oficial</h2>
    <mat-dialog-content>
      <form [formGroup]="campaignForm" style="display: flex; flex-direction: column; gap: 4px; margin-top: 10px; min-width: 320px;">
        
        <mat-form-field appearance="outline">
          <mat-label>Tipo de Intervención</mat-label>
          <mat-select formControlName="tipoIntervencion">
            <mat-option value="Fumigación / Nebulización Térmica">💨 Fumigación / Nebulización Térmica</mat-option>
            <mat-option value="Control Larvario (Abatización)">🐛 Control Larvario (Abatización)</mat-option>
            <mat-option value="Campaña de Descacharrado (Recojo de Inservibles)">🗑️ Campaña de Descacharrado</mat-option>
            <mat-option value="Instalación y Monitoreo de Ovitrampas">🔬 Monitoreo de Ovitrampas</mat-option>
            <mat-option value="Búsqueda Activa de Casos Febriles">🌡️ Búsqueda Activa de Febriles</mat-option>
            <mat-option value="Campaña Médica y Descarte Rápido">🏥 Campaña Médica y Descarte</mat-option>
            <mat-option value="Capacitación Comunitaria y Charlas">📢 Capacitación Comunitaria</mat-option>
          </mat-select>
          @if (tipoIntervencion.invalid && tipoIntervencion.touched) {
            <mat-error>Selecciona el tipo de intervención.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Distrito Destino</mat-label>
          <mat-select formControlName="districtId">
            <mat-option *ngFor="let dist of districts" [value]="dist.idDistrict">
                {{ dist.nameDistrict }}
            </mat-option>
          </mat-select>
          @if (districtId.invalid && districtId.touched) {
            <mat-error>Selecciona el distrito destino.</mat-error>
          }
        </mat-form-field>

        <div style="display: flex; gap: 15px;">
          <mat-form-field appearance="outline" style="flex: 2;">
            <mat-label>Fecha de Inicio</mat-label>
            <input matInput [matDatepicker]="pickerInicio" formControlName="fechaInicioDate" placeholder="Selecciona el día">
            <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
            <mat-datepicker #pickerInicio></mat-datepicker>
            @if (fechaInicioDate.invalid && fechaInicioDate.touched) {
              <mat-error>Obligatorio.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Hora</mat-label>
            <input matInput type="time" formControlName="fechaInicioTime">
          </mat-form-field>
        </div>

        <div style="display: flex; gap: 15px;">
          <mat-form-field appearance="outline" style="flex: 2;">
            <mat-label>Fecha de Finalización</mat-label>
            <input matInput [matDatepicker]="pickerFin" formControlName="fechaFinDate" placeholder="Selecciona el día">
            <mat-datepicker-toggle matIconSuffix [for]="pickerFin"></mat-datepicker-toggle>
            <mat-datepicker #pickerFin></mat-datepicker>
            @if (fechaFinDate.invalid && fechaFinDate.touched) {
              <mat-error>Obligatorio.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Hora</mat-label>
            <input matInput type="time" formControlName="fechaFinTime">
          </mat-form-field>
        </div>

        @if (campaignForm.hasError('endBeforeStart') && (fechaFinDate.touched || fechaFinTime.touched)) {
          <div class="error-banner" style="margin-top: 4px;">
            <mat-icon>error_outline</mat-icon>
            <span>La fecha/hora de finalización debe ser posterior a la de inicio.</span>
          </div>
        }

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding-bottom: 20px; padding-right: 20px;">
      <button mat-button (click)="cancelar()" [disabled]="saving">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="campaignForm.invalid || saving" (click)="guardar()">
        @if (saving) {
          <mat-spinner diameter="18" style="display:inline-block; margin-right:8px;"></mat-spinner>
        }
        {{ saving ? 'Guardando...' : 'Registrar Campaña' }}
      </button>
    </mat-dialog-actions>
  `
})
export class InterventionCampaignInsertComponent implements OnInit {
  private fb = inject(FormBuilder);
  private campaignService = inject(InterventionCampaignService);
  private districtService = inject(DistrictService); // 🚀 Inyectamos el servicio real
  private dialogRef = inject(MatDialogRef<InterventionCampaignInsertComponent>);
  private snackBar = inject(MatSnackBar);

  districts: DistrictDTO[] = [];
  saving = false;

  // Dividimos la estructura interna del formulario para capturar los inputs separados
  campaignForm: FormGroup = this.fb.group({
    tipoIntervencion: ['', Validators.required],
    districtId: [null, Validators.required],
    fechaInicioDate: ['', Validators.required],
    fechaInicioTime: ['08:00', Validators.required], // Valor por defecto mañana
    fechaFinDate: ['', Validators.required],
    fechaFinTime: ['17:00', Validators.required]    // Valor por defecto tarde
  }, { validators: endAfterStartValidator });

  get tipoIntervencion() { return this.campaignForm.get('tipoIntervencion')!; }
  get districtId() { return this.campaignForm.get('districtId')!; }
  get fechaInicioDate() { return this.campaignForm.get('fechaInicioDate')!; }
  get fechaFinDate() { return this.campaignForm.get('fechaFinDate')!; }
  get fechaFinTime() { return this.campaignForm.get('fechaFinTime')!; }

  ngOnInit() {
    this.cargarDistritosDesdeBD();
  }

  // 🚀 CARGA REAL DESDE BASE DE DATOS
  cargarDistritosDesdeBD() {
    this.districtService.list().subscribe({
      next: (data) => {
        this.districts = data;
      },
      error: (err) => {
        console.error('❌ Error al conectar con el endpoint de distritos:', err);
        this.snackBar.open('No se pudieron cargar los distritos.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  cancelar() { this.dialogRef.close(); }

  // Función utilitaria para fusionar el Date de Angular Material con el string de la hora
  private formatsToLocalDateTime(dateObj: Date, timeStr: string): string {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${timeStr}:00`; // Genera formato YYYY-MM-DDTHH:mm:ss
  }

  guardar() {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }
    const formValues = this.campaignForm.value;
    this.saving = true;

    // Combinamos las fechas y horas en el formato que Spring Boot espera
    const fechaInicioISO = this.formatsToLocalDateTime(formValues.fechaInicioDate, formValues.fechaInicioTime);
    const fechaFinISO = this.formatsToLocalDateTime(formValues.fechaFinDate, formValues.fechaFinTime);

    const nuevaCampana = {
      idCampana: 0,
      tipoIntervencion: formValues.tipoIntervencion,
      fechaInicio: fechaInicioISO, 
      fechaFin: fechaFinISO,       
      district: { 
        idDistrict: formValues.districtId,
        // 🚀 Sincronizado aquí también
        nameDistrict: this.districts.find(d => d.idDistrict === formValues.districtId)?.nameDistrict || ''
      }
    };

    this.campaignService.createCampaign(nuevaCampana).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('❌ Error al guardar la campaña en Spring Boot:', err);
        this.saving = false;
        this.snackBar.open('No se pudo registrar la campaña. Intenta nuevamente.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
