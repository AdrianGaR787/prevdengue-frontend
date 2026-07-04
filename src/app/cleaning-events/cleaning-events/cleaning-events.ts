import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CleaningEventService } from '../../../core/services/cleaning-event.services';
import { CleaningEvent } from '../../../core/models/cleaning-event';
import { CleaningEventInsertComponent } from '../cleaning-events-insert/cleaning-events-insert';
import { UserDTO } from '../../../core/models/Report';
import { UserService } from '../../../core/services/user.services';
import { AuthService } from '../../../core/services/auth.services';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';


@Component({
  selector: 'app-participants-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div style="padding: 20px; min-width: 300px;">
      <h2 style="color: #1a237e; font-weight: bold; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
        <mat-icon>people</mat-icon> Usuarios Inscritos
      </h2>
      <ul style="list-style: none; padding: 0; margin: 0; max-height: 300px; overflow-y: auto;">
        <li *ngFor="let user of data.participants" style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
          <mat-icon color="primary">account_circle</mat-icon>
          <span>{{ user.name || user.email || 'Usuario Sin Nombre' }}</span>
        </li>
      </ul>
      <div *ngIf="!data.participants || data.participants.length === 0" style="text-align: center; color: #666; padding: 20px 0;">
        Aún no hay ningún usuario inscrito.
      </div>
      <div style="text-align: right; margin-top: 20px;">
        <button mat-button (click)="dialogRef.close()">Cerrar</button>
      </div>
    </div>
  `
})
export class ParticipantsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ParticipantsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { participants: UserDTO[] }
  ) {}
}

@Component({
  selector: 'app-cleaning-events',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressBarModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './cleaning-events.html'
})
export class CleaningEventsComponent implements OnInit {
  private eventService = inject(CleaningEventService);
  private dialog = inject(MatDialog);
  private userService = inject(UserService); 
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  
  allEvents: CleaningEvent[] = []; 
  filteredEvents: CleaningEvent[] = []; 
  filtroEstado: string = 'TODOS';
  
  currentUserId = 0; 
  currentUserData: any = null; // ID de prueba (Deberás sacarlo del JWT luego)

  ngOnInit() { this.cargarEventos();
    this.obtenerUsuarioLogueado();
   }


   obtenerUsuarioLogueado() {
    const email = this.authService.getEmail();
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.currentUserId = user.idUser; // Asignamos tu ID real
          this.currentUserData = user; // Guardamos todo tu objeto (con nombre, puntos, etc)
          this.cargarEventos(); // 🚀 Recién aquí cargamos los eventos
        },
        error: (err) => console.error('Error buscando usuario', err)
      });
    }
  }

  cargarEventos() {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        const eventosSaneados = data.map(evento => ({
          ...evento,
          status: evento.status ? evento.status.trim().toUpperCase() : 'DESCONOCIDO'
        }));
        this.allEvents = eventosSaneados.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        this.aplicarFiltros(); 
      }
    });
  }

  aplicarFiltros() {
    if (this.filtroEstado === 'TODOS') {
      this.filteredEvents = [...this.allEvents];
    } else {
      this.filteredEvents = this.allEvents.filter(e => e.status === this.filtroEstado);
    }
  }

  getInscritos(event: CleaningEvent): number {
    return event.participants ? event.participants.length : 0;
  }

  yaEstaInscrito(event: CleaningEvent): boolean {
    if (!event.participants) return false;
    return event.participants.some(p => p.idUser === this.currentUserId);
  }

  verAsistentes(participants: UserDTO[]) {
    this.dialog.open(ParticipantsDialogComponent, {
      data: { participants: participants || [] },
      width: '400px'
    });
  }

  abrirDialogoCreacion() {
    const dialogRef = this.dialog.open(CleaningEventInsertComponent, { 
      width: '500px', 
      disableClose: true,
      data: { user: this.currentUserData } // LE ENVIAMOS TU USUARIO REAL AL MODAL
    });
    
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => this.cargarEventos(), 300); 
    });
  }

  unirseAEvento(idEvent: number) {
    this.eventService.joinEvent(idEvent, this.currentUserId).subscribe({
      next: (res) => {
        this.snackBar.open('🎉 ¡Te has inscrito exitosamente!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
        setTimeout(() => this.cargarEventos(), 300); 
      },
      error: (err) => this.snackBar.open('❌ No se pudo unir: ' + (err.error || 'Error desconocido'), 'Cerrar', { duration: 4000 })
    });
  }

  eliminarEvento(idEvent: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar evento', message: '¿Estás seguro de que deseas eliminar este evento de limpieza?', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.eventService.deleteEvent(idEvent).subscribe({
        next: () => setTimeout(() => this.cargarEventos(), 300),
        error: (err) => this.snackBar.open('Error al eliminar. Solo administradores pueden hacer esto.', 'Cerrar', { duration: 4000 })
      });
    });
  }

  abrirEnMapa(lat: number, lng: number) {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  }
}