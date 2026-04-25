import { MaterialModules } from './../../../../../shared/material.providers';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-busqueda-lista',
  imports: [MaterialModules, ReactiveFormsModule],
  templateUrl: './input-busqueda-lista.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBusquedaListaComponent {
  // Configuración vía Inputs
  titulo = input.required<string>();
  placeholder = input<string>('Agregar elemento...');
  icono = input<string>('edit_note');
  colorIcono = input<string>('text-slate-400');
  colorBoton = input<string>('primary');
  claseItem = input<string>('bg-slate-50 border-slate-100');

  // Evento para enviar los datos al padre
  onChanged = output<string[]>();

  // Lógica interna
  control = new FormControl('');
  lista = signal<string[]>([]);

  agregar() {
    const valor = this.control.value?.trim();
    if (valor) {
      this.lista.update((prev) => [...prev, valor]);
      this.control.reset();
      this.onChanged.emit(this.lista());
    }
  }

  eliminar(index: number) {
    this.lista.update((prev) => prev.filter((_, i) => i !== index));
    this.onChanged.emit(this.lista());
  }
}
