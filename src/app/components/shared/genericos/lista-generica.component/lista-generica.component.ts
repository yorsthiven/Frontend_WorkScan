import { CommonModule } from '@angular/common';
import { Component, ContentChild, input, output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-lista-generica',
  imports: [CommonModule],
  templateUrl: './lista-generica.component.html',
})
export class ListaGenericaComponent<T> {
  // // Recibe cualquier array (Trabajadores, Usuarios, etc.)
  // data = input.required<T[]>();
  // // Recibe la configuración de qué columnas mostrar
  // columnas = input.required<{ key: keyof T; label: string }[]>();
  // // Evento al seleccionar una fila
  // filaSeleccionada = output<T>();

  data = input.required<any[]>(); // Usamos any[] por ahora para facilitar la compatibilidad
  columnas = input.required<{ key: string; label: string }[]>();
  filaSeleccionada = output<any>();

  // Buscamos una plantilla que el padre marque con #celdaPersonalizada
  @ContentChild('celdaPersonalizada') plantillaCelda!: TemplateRef<any>;

  seleccionar(item: T) {
    this.filaSeleccionada.emit(item);
  }
}
