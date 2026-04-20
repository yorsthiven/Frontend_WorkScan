import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-items-component',
  imports: [MaterialModules],
  templateUrl: './items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  // 1. Recibe la lista de ítems por input
  itemsInput = input.required<any[]>({ alias: 'items' });

  // Recibimos la lista de ítems (desde la inspección seleccionada)
  // items = input.required<any[]>();


  // 2. Inyectamos las herramientas del Diálogo
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  public dialogRef = inject(MatDialogRef, { optional: true });
  private dialog = inject(MatDialog);

  // 3. Manejo de datos: Prioriza el diálogo si existe, sino usa el input
  items = computed(() => {
    return this.dialogData?.items || this.itemsInput() || [];
  });

  // Índice del ítem que estamos viendo actualmente
  indexActivo = signal(0);

  // Ítem calculado para mostrar en la vista
  // itemActual = computed(() => this.items()[this.indexActivo()]);
  itemActual = computed(() => {
    const lista = this.items();
    return lista.length > 0 ? lista[this.indexActivo()] : null;
  });

  anterior() {
    if (this.indexActivo() > 0) {
      this.indexActivo.update(i => i - 1);
    }
  }

  siguiente() {
    if (this.indexActivo() < this.items().length - 1) {
      this.indexActivo.update(i => i + 1);
    }
  }

  // 5. Método para abrir en pantalla completa
  abrirDetalle() {
    this.dialog.open(ItemsComponent, {
      data: { items: this.items() }, // Pasamos la lista de ítems
      width: '95vw',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'modal-fullscreen-custom'
    });
  }
}
