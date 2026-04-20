import { Component, ContentChild, input, output, TemplateRef } from '@angular/core';
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
  columnas = input.required<any[]>(); // Ej: ['nombre', 'material']
  datos = input.required<any[]>();

  // Captura la plantilla que envías desde el HTML padre
  @ContentChild('plantillaCelda') plantillaCelda?: TemplateRef<any>;

  // Salidas para acciones
  onEdit = output<any>();
  onDelete = output<any>();
  onAdd = output<void>();

  // Helper para mostrar encabezados bonitos
  formatHeader(key: any): string {
    // Si es un objeto, usamos el label. Si es string, lo formateamos.
    const text = typeof key === 'string' ? key : key.label;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Genera los IDs de las columnas para el mat-table
  get displayedColumns(): string[] {
    const keys = this.columnas().map((col) => (typeof col === 'string' ? col : col.key));
    return [...keys, 'acciones'];
  }
}
