import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  /** Usa colores de "peligro" para acciones destructivas como eliminar */
  danger?: boolean;
}

/**
 * Diálogo de confirmación reutilizable, reemplaza al confirm() nativo del navegador.
 * Uso típico:
 *
 *   this.dialog.open(ConfirmDialogComponent, {
 *     data: { title: 'Eliminar distrito', message: '¿Eliminar este distrito de forma permanente?', danger: true }
 *   }).afterClosed().subscribe(confirmed => {
 *     if (confirmed) { ... }
 *   });
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="confirm-title" [class.danger]="data.danger">
      <mat-icon>{{ data.danger ? 'warning' : 'help_outline' }}</mat-icon>
      {{ data.title || 'Confirmar acción' }}
    </h2>
    <mat-dialog-content class="confirm-content">
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="dialogRef.close(false)">
        {{ data.cancelText || 'Cancelar' }}
      </button>
      <button mat-raised-button
              [color]="data.danger ? 'warn' : 'primary'"
              (click)="dialogRef.close(true)"
              cdkFocusInitial>
        {{ data.confirmText || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--primary-dark, #1E40AF);
    }
    .confirm-title.danger {
      color: var(--danger, #EF4444);
    }
    .confirm-content {
      color: var(--text-muted, #64748B);
      min-width: 280px;
      padding-top: 4px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
