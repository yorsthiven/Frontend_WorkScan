import { MaterialModules } from './../../../shared/material.providers';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../services/inspeccion/inspeccion.service';
import { RespuestaGetInspecciones } from '../../../models/Respuestas/responses.model';
import { DatePipe } from '@angular/common';
import { ItemsComponent } from '../items-component/items.component';
import { SintomatologiaComponent } from '../sintomatologia-component/sintomatologia.component';
import { InspeccionDetalle } from '../../../models/inspeccionDetalle.nodel';
import { InspeccionInfoComponent } from './components/inspeccion-info.component/inspeccion-info.component';
import { Router } from '@angular/router';
import { ReporteService } from '../../../services/reportes/reporte.service';
import Swal from 'sweetalert2';
import { SpinnerGenericoComponent } from "../../../components/shared/genericos/spinner-generico.component/spinner-generico.component";

@Component({
  selector: 'app-inspecciones-page',
  imports: [
    MaterialModules,
    TablaMaestraComponent,
    DatePipe,
    ItemsComponent,
    SintomatologiaComponent,
    InspeccionInfoComponent,
    SpinnerGenericoComponent
],
  templateUrl: './inspecciones-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspeccionesPage {
  private inspeccionService = inject(InspeccionService);
  private reporteService = inject(ReporteService);
  // listaInspecciones = signal([{}]);
  listaInspecciones = signal<any[]>([]);
  inspecciones = signal<InspeccionDetalle[]>([]);
  isLoading = signal(false);

  /**
   * En el constructor, cargamos las inspecciones sin filtro para mostrar todo inicialmente.
   * Luego, cada vez que el usuario escriba en el campo de búsqueda, se llamará a filtrarInspecciones con el término ingresado.
   * Si el término es vacío, se mostrarán todas las inspecciones.
   * Si el término no coincide con nada, la tabla mostrará un mensaje de "No encontrado" automáticamente al tener la lista vacía.
   * Si el término coincide con algunas inspecciones, se mostrarán solo esas.
   * Además, cada vez que se filtre, se actualiza la señal 'inspecciones' con los resultados obtenidos del servicio.
   * Esto garantiza que la tabla siempre muestre datos actualizados según el término de búsqueda ingresado por el usuario.
   */

  constructor() {
    this.filtrarInspecciones('');
  }

  filtrarInspecciones(termino: string) {
    this.inspeccionService.getInspeccion(termino).subscribe({
      next: (data: RespuestaGetInspecciones) => {
        // console.log(data);
        this.inspecciones.set(data.inspecciones);
      },
      error: (err) => {
        // this.inspecciones.set([]); // <--- Esto fuerza a la tabla a mostrar el mensaje de "No encontrado"
      },
    });
  }
  // En el padre (Configuración de Inspecciones)
  colsInspeccion = signal([
    { key: 'fechaInspeccion', label: 'Fecha Inspección', width: '180px' },
    { key: 'documentoTrabajador', label: 'Documento' },
    { key: 'nombreTrabajador', label: 'Trabajador' },
    { key: 'cargoTrabajador', label: 'Cargo', cssClass: 'font-bold' },
    { key: 'calificacionEva', label: 'EVA', cssClass: 'font-bold' },
  ]);

  // Método para el color del semáforo
  getEvaColor(valor: number): string {
    if (valor <= 1) return 'bg-green-500';
    if (valor <= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  // Señal que simula el ítem seleccionado en tu tabla
  itemSeleccionado = signal<any | null>(null);

  seleccionarFila(fila: any) {
    this.itemSeleccionado.set(fila);
  }
  private router = inject(Router);
  // Esta es la función que se ejecuta al darle click al botón "+"
  irARegistro() {
    this.router.navigate(['dashboard/inspecciones/registro']); // La ruta que definas en tu app.routes.ts
  }

  descargarReporte(inspeccion: any) {
    // console.log('Seleccionado ID Inspección: ', inspeccion.idInspeccion);
    this.isLoading.set(true);
    this.reporteService.generarReporte(inspeccion.idInspeccion).subscribe({
      next: (res: Blob) => {
        this.isLoading.set(false);
        // 1. Creamos una URL local y temporal apuntando al objeto binario del PDF
        const url = window.URL.createObjectURL(res);

        // 2. Creamos un elemento de anclaje (<a>) oculto en memoria
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // 3. Le asignamos un nombre dinámico al archivo descargado
        a.download = `Reporte_Inspeccion_SST_${inspeccion.idInspeccion}.pdf`;

        // 4. Inyectamos el elemento al DOM, simulamos el click y lo removemos de inmediato
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // console.log('¡Reporte descargado con éxito!');
      },
      error: (err) => {
        this.isLoading.set(false);
        // console.error('erroorrr', err);
        Swal.fire({
          title: 'Error',
          text: `${err.error?.mensaje || ''}`,
          icon: 'error',
        });
      },
    });
  }
}
