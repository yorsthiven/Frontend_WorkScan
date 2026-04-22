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
    // Manejo robusto: si no hay label ni key, retornamos vacío para no romper el render
    if (!key) return '';
    const text = typeof key === 'string' ? key : key.label || key.key || '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Genera los IDs de las columnas para el mat-table
  get displayedColumns(): string[] {
    const keys = this.columnas().map((col) => (typeof col === 'string' ? col : col.key));
    return [...keys, 'acciones'];
  }
}
