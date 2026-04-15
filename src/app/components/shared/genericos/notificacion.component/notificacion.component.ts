import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-notificacion',
  imports: [MatIcon],
  // templateUrl: './notificacion.component.html',
  template: `
    <div class="notificacion-container" [class]="data.tipo">
      <mat-icon class="icon">{{ data.icon }}</mat-icon>
      <div class="content">
        <div class="titulo">{{ data.titulo }}</div>
        <div class="mensaje">{{ data.mensaje }}</div>
      </div>
      <button class="close-btn" (click)="snackBarRef.dismiss()">×</button>
    </div>
  `,
  styles: [
    `
      .notificacion-container {
        display: flex;
        align-items: center;
        padding: 16px;
        border-radius: 8px;
        border-left: 6px solid;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        min-width: 300px;
        color: #1e293b;
      }
      /* Colores por tipo */
      .success {
        border-left-color: #10b981;
        background: #ecfdf5;
      }
      .error {
        border-left-color: #ef4444;
        background: #fef2f2;
      }
      .warning {
        border-left-color: #f59e0b;
        background: #fffbeb;
      }

      .icon {
        margin-right: 12px;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
      .success .icon {
        color: #10b981;
      }
      .error .icon {
        color: #ef4444;
      }
      .warning .icon {
        color: #f59e0b;
      }

      .content {
        flex-grow: 1;
      }
      .titulo {
        font-weight: 900;
        font-size: 14px;
        text-transform: uppercase;
      }
      .mensaje {
        font-size: 13px;
        color: #64748b;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #94a3b8;
      }
    `,
  ],
})
export class NotificacionComponent {
  snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);
}
