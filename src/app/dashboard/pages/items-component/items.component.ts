import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-items-component',
  imports: [MaterialModules],
  templateUrl: './items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  // Recibimos la lista de ítems (desde la inspección seleccionada)
  items = input.required<any[]>();

  // Índice del ítem que estamos viendo actualmente
  indexActivo = signal(0);

  // Ítem calculado para mostrar en la vista
  itemActual = computed(() => this.items()[this.indexActivo()]);

  siguiente() {
    if (this.indexActivo() < this.items().length - 1) {
      this.indexActivo.update((i) => i + 1);
    }
  }

  anterior() {
    if (this.indexActivo() > 0) {
      this.indexActivo.update((i) => i - 1);
    }
  }
}
