import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../services/inspeccion/inspeccion.service';
import { RespuestaGetInspecciones } from '../../../models/Respuestas/responses.model';

@Component({
  selector: 'app-inspecciones-page',
  imports: [TablaMaestraComponent],
  templateUrl: './inspecciones-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspeccionesPage {
  private inspeccionService = inject(InspeccionService);
  listaInspecciones = signal([{}]);

  /**
   *
   */
  constructor() {
    this.inspeccionService.getInspeccion().subscribe((res: RespuestaGetInspecciones) => {
      console.log(res);
      this.listaInspecciones.set(
        res.inspecciones.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()),
      ); //ordenar por fecha o por id
    });
  }

  // En el padre (Configuración de Inspecciones)
  colsInspeccion = signal([
    { key: 'fecha', label: 'Fecha', width: '150px' },
    { key: 'inspector', label: 'Responsable' },
    { key: 'puntaje', label: 'Resultado', cssClass: 'font-bold' },
  ]);
}
