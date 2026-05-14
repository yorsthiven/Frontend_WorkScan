import { environment } from '../../../../enviroments/environment';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  effect,
} from '@angular/core';

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

  // 2. Agregamos este efecto para limpiar el carrusel de fotos
  constructor() {
    this.fotoIndex.set(0);
    // Efecto adicional para monitorear cambios en la lista de ítems (cambio de inspección)
    effect(() => {
      this.items();
      // Cuando cambia la lista de ítems, resetear ambos índices
      this.indexActivo.set(0);
      this.fotoIndex.set(0);
    });
  }
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
      this.fotoIndex.set(0);
      this.indexActivo.update((i) => i - 1);
    }
  }

  siguiente() {
    if (this.indexActivo() < this.items().length - 1) {
      this.fotoIndex.set(0);
      this.indexActivo.update((i) => i + 1);
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

  // Método para limpiar y armar la ruta exacta hacia los archivos de wwwroot
  getFotoUrl(fotoPath: string | undefined): string {
    if (!fotoPath) return '/no-image.jpg'; // Imagen por defecto si no hay ruta

    // 1. Si tu base de datos devuelve la palabra "apiuploads", la corregimos por "uploads"
    let pathLimpio = fotoPath.replace('apiuploads/', 'uploads/');

    // 2. Reemplazamos barras invertidas de Windows (\) por barras normales (/)
    pathLimpio = pathLimpio.replace(/\\/g, '/').trim();

    // 3. Quitamos barra inicial si existe para evitar dobles barras "//"
    if (pathLimpio.startsWith('/')) {
      pathLimpio = pathLimpio.substring(1);
    }

    // 4. Extraemos la raíz del servidor (ej: 'https://localhost:7064/') quitándole el '/api'
    // Esto evita alterar tu environment.apiUrl global que usan tus servicios de datos
    const serverBase = this.API_URL.replace(/\/api\/?$/, '');
    const baseUrl = serverBase.endsWith('/') ? serverBase : `${serverBase}/`;

    // Retorna la combinación perfecta: https://localhost:7064/uploads/inspecciones/imagen1.png
    return `${baseUrl}${pathLimpio}`;
  }

  // Dentro de tu clase
  tabActiva = signal<TabTipo>('hallazgos');
  // No olvides agregar este método para que los botones funcionen
  setTab(tab: TabTipo) {
    this.tabActiva.set(tab);
  }
}
