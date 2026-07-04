import { Component, OnInit, inject, ViewChild, AfterViewInit, Inject} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms'; // 🚀 NECESARIO PARA EL COMENTARIO
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // 🚀 NECESARIO PARA MODALES
import { Router } from '@angular/router'; // 🚀 IMPORTANTE

import { ReportService } from '../../../core/services/report';
import { ReportDTO } from '../../../core/models/Report'; 
import { NeighborValidationService } from '../../../core/services/neighbor-validation.services';
import { AuthService } from '../../../core/services/auth.services';
import { UserService } from '../../../core/services/user.services';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';

// ====================================================================
// 🚀 MODAL 1: PARA ESCRIBIR EL COMENTARIO AL VOTAR
// ====================================================================
@Component({
  selector: 'app-validation-comment-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Añadir un Comentario</h2>
    <mat-dialog-content>
      <p>Describe brevemente por qué estás confirmando o desmintiendo este reporte (Opcional):</p>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Comentario</mat-label>
        <textarea matInput [(ngModel)]="comentario" rows="3" placeholder="Ej: Pasé por ahí y el charco ya se secó..."></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(comentario)">Enviar Validación</button>
    </mat-dialog-actions>
  `
})
export class ValidationCommentDialog {
  comentario: string = '';
  constructor(public dialogRef: MatDialogRef<ValidationCommentDialog>) {}
}

// ====================================================================
// 🚀 MODAL 2: PARA VER LA LISTA DE VALIDACIONES DE UN REPORTE
// ====================================================================
@Component({
  selector: 'app-validation-list-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, DatePipe],
  template: `
    <h2 mat-dialog-title style="color: #1a237e;">
      <mat-icon style="vertical-align: middle; margin-right: 8px;">forum</mat-icon> Validaciones Vecinales
    </h2>
    <mat-dialog-content>
      <div *ngIf="data.validaciones.length === 0" style="text-align: center; color: #666; padding: 20px;">
        Aún no hay validaciones para este reporte.
      </div>
      
      <div *ngFor="let val of data.validaciones" style="border-bottom: 1px solid #eee; padding: 10px 0; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <strong style="color: #333;">{{ val.validatorUser?.name || val.validatorUser?.email || 'Vecino Anónimo' }}</strong>
          <span style="font-size: 0.85rem; color: #888;">{{ val.validationDate | date:'short' }}</span>
        </div>
        
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
          <mat-icon [ngStyle]="{'color': val.valid ? 'red' : 'green'}" style="font-size: 18px; width: 18px; height: 18px;">
            {{ val.valid ? 'report_problem' : 'check_circle' }}
          </mat-icon>
          <span [ngStyle]="{'color': val.valid ? 'red' : 'green', 'font-weight': '500'}">
            {{ val.valid ? 'Confirma el peligro' : 'Reporta como limpio' }}
          </span>
        </div>
        <p style="margin: 0; color: #555; font-style: italic; font-size: 0.95rem;">"{{ val.comments || 'Sin comentarios.' }}"</p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class ValidationListDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { validaciones: any[] }) {}
}


// ====================================================================
// COMPONENTE PRINCIPAL (LA TABLA)
// ====================================================================
@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatCardModule, MatButtonModule, 
    MatIconModule, DatePipe, RouterModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatPaginatorModule, MatTooltipModule
  ],
  templateUrl: './report-list.html',
  styleUrls: ['./report-list.css']
})
export class ReportList implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'user', 'hatchery', 'status', 'date', 'district', 'symptoms', 'description', 'actions'];
  dataSource = new MatTableDataSource<ReportDTO>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private router = inject(Router);

  private reportService = inject(ReportService);
  private snackBar = inject(MatSnackBar);
  private validationService = inject(NeighborValidationService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private dialog = inject(MatDialog); // 🚀 INYECTAMOS EL DIALOG

  currentUser: any = null;

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
    this.loadReports();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  obtenerUsuarioLogueado() {
    const email = this.authService.getEmail();
    if (email) {
      this.userService.getUserByEmail(email).subscribe(user => this.currentUser = user);
    }
  }

  loadReports() {
    this.reportService.list().subscribe({
      next: (data) => this.dataSource.data = data.sort((a, b) => a.idReport - b.idReport),
      error: (err) => console.error('Error al cargar reportes', err)
    });
  }
  editar(idReporte: number) {
    // Esto fuerza a Angular a usar la ruta exacta de tu app.routes.ts
    this.router.navigate(['/dashboard/reportes/editar', idReporte]);
  }

  // 🚀 1. LÓGICA DE VOTACIÓN MEJORADA (Abre modal de comentario y genera fecha)
  validarReporte(idReporte: number, esValido: boolean) {
    if (!this.currentUser) {
      this.snackBar.open('Debes estar logueado para validar.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Abrimos el modal para pedir el comentario
    const dialogRef = this.dialog.open(ValidationCommentDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe(comentarioEscrito => {
      // Si el usuario cerró el modal sin darle a Enviar, el valor será 'undefined'
      if (comentarioEscrito !== undefined) {
        
        // 🚀 FECHA AUTOMÁTICA: Formato exacto que le gusta a Spring Boot (YYYY-MM-DDTHH:mm:ss)
        const fechaActual = new Date().toISOString().slice(0, 19);

        const payloadDTO: any = {
          idValidation: 0,
          valid: esValido,
          comments: comentarioEscrito,
          validationDate: fechaActual, // 🚀 ENVIAMOS LA FECHA DE HOY
          report: { idReport: idReporte },
          validatorUser: this.currentUser
        };

        this.validationService.registerValidation(payloadDTO).subscribe({
          next: () => {
            const msj = esValido ? '⚠️ Confirmaste este foco de dengue' : '✅ Reportaste este foco como limpio';
            this.snackBar.open(msj, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al validar:', err);
            this.snackBar.open('Error al registrar tu validación', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  // 🚀 2. FUNCIÓN PARA VER LA LISTA DE VALIDACIONES
  verValidaciones(idReporte: number) {
    this.validationService.getAllValidations().subscribe({
      next: (todasLasValidaciones) => {
        // Filtramos para mostrar solo las que pertenecen a la fila que el usuario clickeó
        const validacionesDelReporte = todasLasValidaciones.filter(v => v.report.idReport === idReporte);
        
        // Abrimos el modal enviándole la lista filtrada
        this.dialog.open(ValidationListDialog, {
          data: { validaciones: validacionesDelReporte },
          width: '500px'
        });
      },
      error: (err) => {
        console.error('Error al traer validaciones', err);
        this.snackBar.open('Error al consultar validaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteReport(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Eliminar reporte', message: '¿Estás seguro de que deseas eliminar este reporte?', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.reportService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Reporte eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadReports();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.snackBar.open('Error al eliminar el reporte.', 'Cerrar', { duration: 4000 });
        }
      });
    });
  }
}