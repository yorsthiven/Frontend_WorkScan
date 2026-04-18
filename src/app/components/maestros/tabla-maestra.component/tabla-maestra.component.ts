import { Component, input, output } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-tabla-maestra',
  imports: [MaterialModules],
  templateUrl: './tabla-maestra.component.html',
})
export class TablaMaestraComponent {
  // Entradas
  titulo = input.required<string>();
  colorBorder = input<string>('border-blue-500'); // Por defecto azul
  columnas = input.required<string[]>(); // Ej: ['nombre', 'material']
  datos = input.required<any[]>();

  // Salidas para acciones
  onEdit = output<any>();
  onDelete = output<any>();
  onAdd = output<void>();

  // Helper para mostrar encabezados bonitos
  formatHeader(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
}
