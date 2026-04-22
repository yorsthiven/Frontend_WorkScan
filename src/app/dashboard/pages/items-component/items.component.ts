import { environment } from './../../../../../enviroment';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

type TabTipo = 'hallazgos' | 'recomendaciones' | 'especificaciones';

@Component({
  selector: 'app-items-component',
  imports: [MaterialModules],
  templateUrl: './items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  // 1. Recibe la lista de ítems por input
  itemsInput = input.required<any[]>({ alias: 'items' });
  // ... dentro de tu componente ...
  readonly API_URL = environment.apiUrl;
  // Recibimos la lista de ítems (desde la inspección seleccionada)
  // items = input.required<any[]>();

  // 2. Inyectamos las herramientas del Diálogo
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  public dialogRef = inject(MatDialogRef, { optional: true });
  private dialog = inject(MatDialog);

  // Crea una señal para la foto actual del carrusel interno
  fotoIndex = signal(0);

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
      this.indexActivo.update((i) => i - 1);
      this.fotoIndex.set(0);
    }
  }

  siguiente() {
    if (this.indexActivo() < this.items().length - 1) {
      this.indexActivo.update((i) => i + 1);
      this.fotoIndex.set(0);
    }
  }

  // 5. Método para abrir en pantalla completa
  abrirDetalle() {
    this.dialog.open(ItemsComponent, {
      data: { items: this.items() }, // Pasamos la lista de ítems
      width: '95vw',
      maxWidth: '1200px',
      height: '90vh',
      panelClass: 'modal-fullscreen-custom',
    });
  }

  // Método para limpiar y armar la ruta
  getFotoUrl(fotoPath: string | undefined): string {
    if (!fotoPath) return '/no-image.jpg'; // Imagen por defecto

    // Si por error guardaste la ruta con una barra inicial, la quitamos
    const pathLimpio = fotoPath.startsWith('/') ? fotoPath.substring(1) : fotoPath;
    return `${this.API_URL}${pathLimpio}`;
  }

  // Define el tipo de pestaña para seguridad de tipado

  // Dentro de tu clase
  tabActiva = signal<TabTipo>('hallazgos');
  // No olvides agregar este método para que los botones funcionen
  setTab(tab: TabTipo) {
    this.tabActiva.set(tab);
  }
}

