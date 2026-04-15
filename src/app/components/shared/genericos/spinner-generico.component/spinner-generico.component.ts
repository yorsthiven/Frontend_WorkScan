import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spinner-generico',
  standalone: true,
  template: `
    <div class="overlay">
      <div class="spinner-container">
        <div class="spinner" [style.width.px]="size()" [style.height.px]="size()"></div>
        <p class="loading-text">Procesando solicitud...</p>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed; /* O 'absolute' si solo quieres que cubra el modal */
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(255, 255, 255, 0.7); /* Fondo blanco traslúcido */
      backdrop-filter: blur(4px);           /* Efecto de desenfoque muy pro */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999; /* Por encima de todo */
      border-radius: inherit;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2563eb; /* El azul que estás usando */
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      color: #1e293b;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerGenericoComponent {
  size = input<number>(50); // Un poco más grande para el centro de la pantalla
}
