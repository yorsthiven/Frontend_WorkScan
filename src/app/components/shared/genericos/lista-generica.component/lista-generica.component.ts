import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, output, TemplateRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-lista-generica',
  imports: [CommonModule, MatIcon],
  templateUrl: './lista-generica.component.html',
})
export class ListaGenericaComponent<T> {
  // Recibe cualquier array (Trabajadores, Usuarios, etc.)
  data = input.required<any[]>(); // Usamos any[] por ahora para facilitar la compatibilidad
  // Recibe la configuración de qué columnas mostrar
  // columnas = input.required<{ key: string; label: string }[]>();
  columnas = input.required<any[]>();
  // Evento al seleccionar una fila
  filaSeleccionada = output<any>();

  // ESTO ES LO QUE TE FALTA:
  // @Output() onEdit = new EventEmitter<any>();
  onEdit = output<any>();
  // Buscamos una plantilla que el padre marque con #celdaPersonalizada
  @ContentChild('celdaPersonalizada') plantillaCelda!: TemplateRef<any>;

  seleccionar(item: T) {
    this.filaSeleccionada.emit(item);
  }

  // Función que se dispara desde el botón del HTML
  editar(item: any) {
    this.onEdit.emit(item); // Emitimos el objeto completo (el trabajador)
  }
}
