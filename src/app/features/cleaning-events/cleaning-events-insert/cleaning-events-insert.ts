import { Component, inject, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CleaningEventService } from '../../../core/services/cleaning-event.services';
import { AuthService } from '../../../core/services/auth.services';
import * as L from 'leaflet';

// 📅 Validador personalizado: la fecha del evento debe ser en el futuro
function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selected = new Date(control.value);
  return selected.getTime() > Date.now() ? null : { pastDate: true };
}

@Component({
  selector: 'app-cleaning-event-insert',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>Organizar Nuevo Evento</h2>
    <mat-dialog-content>
      <form [formGroup]="eventForm" style="display: flex; flex-direction: column; gap: 4px; margin-top: 10px; min-width: 320px;">
        <mat-form-field appearance="outline">
          <mat-label>Título del Evento</mat-label>
          <input matInput formControlName="title" placeholder="Ej: Limpieza Parque Central" maxlength="80">
          <mat-icon matSuffix>volunteer_activism</mat-icon>
          @if (title.invalid && title.touched) {
            @if (title.hasError('required')) { <mat-error>El título es obligatorio.</mat-error> }
            @if (title.hasError('minlength')) { <mat-error>Debe tener al menos 5 caracteres.</mat-error> }
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha y Hora</mat-label>
          <input matInput type="datetime-local" formControlName="eventDate">
          <mat-icon matSuffix>event</mat-icon>
          @if (eventDate.invalid && eventDate.touched) {
            @if (eventDate.hasError('required')) { <mat-error>Selecciona una fecha para el evento.</mat-error> }
            @if (eventDate.hasError('pastDate')) { <mat-error>La fecha debe ser posterior al momento actual.</mat-error> }
          }
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Aforo Máximo</mat-label>
          <input matInput type="number" formControlName="maxCapacity" min="1" max="500">
          <mat-icon matSuffix>groups</mat-icon>
          <mat-hint>Número máximo de voluntarios que pueden inscribirse.</mat-hint>
          @if (maxCapacity.invalid && maxCapacity.touched) {
            @if (maxCapacity.hasError('required')) { <mat-error>Indica el aforo máximo.</mat-error> }
            @if (maxCapacity.hasError('min')) { <mat-error>Debe ser al menos 1 persona.</mat-error> }
            @if (maxCapacity.hasError('max')) { <mat-error>El máximo permitido es 500 personas.</mat-error> }
          }
        </mat-form-field>

        <p style="margin: 8px 0 4px; font-weight: bold; color: var(--text-muted);">Arrastra el marcador a la ubicación del evento:</p>
        <div id="mapa-insert" style="height: 250px; width: 100%; border-radius: 8px; z-index: 1;"></div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelar()" [disabled]="saving">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="eventForm.invalid || saving" (click)="guardar()">
        @if (saving) {
          <mat-spinner diameter="18" style="display:inline-block; margin-right:8px;"></mat-spinner>
        }
        {{ saving ? 'Guardando...' : 'Guardar Evento' }}
      </button>
    </mat-dialog-actions>
  `
})
export class CleaningEventInsertComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private eventService = inject(CleaningEventService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<CleaningEventInsertComponent>);
  private snackBar = inject(MatSnackBar);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  private map: any;
  private marker: any;
  saving = false;

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
    eventDate: ['', [Validators.required, futureDateValidator]],
    latitude: [-12.215, Validators.required],
    longitude: [-76.938, Validators.required],
    maxCapacity: [20, [Validators.required, Validators.min(1), Validators.max(500)]]
  });

  get title() { return this.eventForm.get('title')!; }
  get eventDate() { return this.eventForm.get('eventDate')!; }
  get maxCapacity() { return this.eventForm.get('maxCapacity')!; }

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
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    const formValues = this.eventForm.value;
    this.saving = true;
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
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.snackBar.open('No se pudo crear el evento. Intenta nuevamente.', 'Cerrar', { duration: 4000 });
      }
    });
  }
}
