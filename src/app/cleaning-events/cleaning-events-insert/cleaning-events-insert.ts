import { Component, OnInit, inject, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CleaningEventService } from '../../../core/services/cleaning-event.services';
import { AuthService } from '../../../core/services/auth.services';
import * as L from 'leaflet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 


@Component({
  selector: 'app-cleaning-event-insert',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Organizar Nuevo Evento</h2>
    <mat-dialog-content>
      <form [formGroup]="eventForm" style="display: flex; flex-direction: column; gap: 15px; margin-top: 10px;">
        <mat-form-field appearance="outline">
          <mat-label>Título del Evento</mat-label>
          <input matInput formControlName="title" placeholder="Ej: Limpieza Parque Central">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha y Hora</mat-label>
          <input matInput type="datetime-local" formControlName="eventDate">
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Aforo Máximo</mat-label>
            <input matInput type="number" formControlName="maxCapacity">
          </mat-form-field>
        
        <p style="margin: 0; font-weight: bold; color: #666;">Arrastra el marcador a la ubicación del evento:</p>
        <div id="mapa-insert" style="height: 250px; width: 100%; border-radius: 8px; z-index: 1;"></div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="eventForm.invalid" (click)="guardar()">Guardar Evento</button>
    </mat-dialog-actions>
  `
})
export class CleaningEventInsertComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private eventService = inject(CleaningEventService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<CleaningEventInsertComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  private map: any;
  private marker: any;

  eventForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    eventDate: ['', Validators.required],
    latitude: [-12.215, Validators.required], 
    longitude: [-76.938, Validators.required],
    maxCapacity: [20, [Validators.required, Validators.min(1)]]
  });

  // 🚀 Inicializamos el mapa después de que se dibuja el HTML del Modal
  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // Centramos el mapa inicial en Lima/Villa el Salvador
    this.map = L.map('mapa-insert').setView([-12.215, -76.938], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const icon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41]
    });

    this.marker = L.marker([-12.215, -76.938], { icon: icon, draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.eventForm.patchValue({
        latitude: position.lat,
        longitude: position.lng
      });
    });
    
    setTimeout(() => { this.map.invalidateSize(); }, 200);
  }

  cancelar() { this.dialogRef.close(); }

  guardar() {
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;
      const nuevoEvento: any = {
        idEvent: 0,
        title: formValues.title, 
        latitude: formValues.latitude, 
        longitude: formValues.longitude,
        eventDate: formValues.eventDate, 
        status: 'PROGRAMADO',
        maxCapacity: formValues.maxCapacity || 20, 
        
        // 🚀 AQUÍ PONEMOS TUS DATOS REALES (Los que recibimos en el constructor)
        creatorUser: this.data.user
      };
      
      this.eventService.createEvent(nuevoEvento).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error(err)
      });
    }
  }
}