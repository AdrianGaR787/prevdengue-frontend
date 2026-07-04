import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';       
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InterventionCampaignService } from '../../../core/services/intervention-campaign-service'; 
import { DistrictService } from '../../../core/services/district'; 
import { DistrictDTO } from '../../../core/models/intervention-campaign';
import { provideNativeDateAdapter } from '@angular/material/core';

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
    MatDatepickerModule, // 🚀 Añadido
    MatNativeDateModule,  // 🚀 Añadido
    MatSnackBarModule
  ],
  providers: [provideNativeDateAdapter()],
  template: `
    <h2 mat-dialog-title style="color: #1a237e; font-weight: bold;">Registrar Campaña Oficial</h2>
    <mat-dialog-content>
      <form [formGroup]="campaignForm" style="display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
        
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
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Distrito Destino</mat-label>
          <mat-select formControlName="districtId">
            <mat-option *ngFor="let dist of districts" [value]="dist.idDistrict">
                {{ dist.nameDistrict }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div style="display: flex; gap: 15px;">
          <mat-form-field appearance="outline" style="flex: 2;">
            <mat-label>Fecha de Inicio</mat-label>
            <input matInput [matDatepicker]="pickerInicio" formControlName="fechaInicioDate" placeholder="Selecciona el día">
            <mat-datepicker-toggle matIconSuffix [for]="pickerInicio"></mat-datepicker-toggle>
            <mat-datepicker #pickerInicio></mat-datepicker>
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
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Hora</mat-label>
            <input matInput type="time" formControlName="fechaFinTime">
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding-bottom: 20px; padding-right: 20px;">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="campaignForm.invalid" (click)="guardar()">Registrar Campaña</button>
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

  // Dividimos la estructura interna del formulario para capturar los inputs separados
  campaignForm: FormGroup = this.fb.group({
    tipoIntervencion: ['', Validators.required],
    districtId: [null, Validators.required],
    fechaInicioDate: ['', Validators.required],
    fechaInicioTime: ['08:00', Validators.required], // Valor por defecto mañana
    fechaFinDate: ['', Validators.required],
    fechaFinTime: ['17:00', Validators.required]    // Valor por defecto tarde
  });

  ngOnInit() {
    this.cargarDistritosDesdeBD();
  }

  // 🚀 CARGA REAL DESDE BASE DE DATOS
  cargarDistritosDesdeBD() {
    this.districtService.list().subscribe({
      next: (data) => {
        this.districts = data;
        console.log('✅ Distritos cargados desde la base de datos:', this.districts);
      },
      error: (err) => console.error('❌ Error al conectar con el endpoint de distritos:', err)
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
    if (this.campaignForm.valid) {
      const formValues = this.campaignForm.value;
      
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
          this.snackBar.open('No se pudo registrar la campaña. Intenta nuevamente.', 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}