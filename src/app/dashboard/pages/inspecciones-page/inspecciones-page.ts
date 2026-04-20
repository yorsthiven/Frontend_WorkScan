import { MaterialModules } from './../../../shared/material.providers';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../services/inspeccion/inspeccion.service';
import { RespuestaGetInspecciones } from '../../../models/Respuestas/responses.model';
import { DatePipe } from '@angular/common';
import { ItemsComponent } from '../items-component/items.component';
import { SintomatologiaComponent } from '../sintomatologia-component/sintomatologia.component';

@Component({
  selector: 'app-inspecciones-page',
  imports: [
    MaterialModules,
    TablaMaestraComponent,
    DatePipe,
    ItemsComponent,
    SintomatologiaComponent,
  ],
  templateUrl: './inspecciones-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspeccionesPage {
  private inspeccionService = inject(InspeccionService);
  // listaInspecciones = signal([{}]);
  listaInspecciones = signal<any[]>([]);

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
    { key: 'fecha', label: 'Fecha', width: '180px' },
    { key: 'documentoTrabajador', label: 'Documento' },
    { key: 'nombreTrabajador', label: 'Trabajador' },
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

  // Datos de prueba con una lista de ítems para el carousel
  inspeccionDePrueba = {
    id: 123,
    fecha: '2026-04-20T08:00:00Z',
    trabajador: 'George Stiven Medina',
    calificacionEva: 8,
    tipoDolor: {id:1,nombre:"moderado"},
    antecedentesDolor: 'aqui se muestran los primeros antecedentes aqui se muestran los primeros antecedentes aqui se muestran los primeros antecedentes aqui se muestran los primeros antecedentes aqui se muestran los primeros antecedentes',
    diagnosticoPrincipal: 'lo siento, pero voy a salir adelante lo siento, pero voy a salir adelante lo siento, pero voy a salir adelante lo siento, pero voy a salir adelantelo siento, pero voy a salir adelante lo siento, pero voy a salir adelante lo siento, pero voy a salir adelante lo siento, pero voy a salir adelante lo siento, pero voy a salir adelantelo siento, pero voy a salir adelante',
    itemsList: [
      {
        fotoUrl:
          'https://www.sstsalud.com/wp-content/uploads/2022/10/Arseg-10096AR-casco-dielectrico-rachet-300x300-1.jpg',
        nombre: 'Casco de Seguridad MSA v-Gard',
        material: 'Polímero de alta resistencia',
        estado: 'Crítico',
        ubicacion: 'Almacén Central',
        hallazgos:
          'Se observa fisura longitudinal en la parte superior del casquete. El sistema de suspensión (tafilete) presenta desgaste excesivo en los puntos de anclaje.',
        recomendaciones:
          'Retirar el equipo de servicio inmediatamente. No es apto para protección contra impactos según norma ANSI Z89.1.',
      },
      {
        fotoUrl: 'https://www.seguridadyaltura.com/wp-content/uploads/2022/03/8004-1.jpg',
        nombre: 'Arnés de Seguridad Multipropósito',
        material: 'Nylon / Poliéster reforzado',
        estado: 'En Observación',
        ubicacion: 'Torre de Control - Alturas',
        hallazgos:
          'Costuras de seguridad íntegras, pero se detecta oxidación leve en la argolla dorsal. Las hebillas de ajuste rápido funcionan correctamente.',
        recomendaciones:
          'Realizar limpieza profunda y aplicar inhibidor de corrosión en herrajes. Programar nueva inspección en 15 días.',
      }
    ],
    // datos: {
    //   id: 1,
    //   calificacionEva: 5,
    //   tipoDolor: 1,
    //   antecedentesDolor: 'aqui se muestran los primeros antecedentes',
    //   diagnosticoPrincipal: 'lo siento, pero voy a salir adelante',
    // },
  };

  // Método para simular la selección en la tabla
  seleccionarInspeccion() {
    this.itemSeleccionado.set(this.inspeccionDePrueba);
  }

  // Añade esta función dentro de tu clase InspeccionesPage
  seleccionarFila(fila: any) {
    // Aquí asignas la fila seleccionada.
    // Nota: Asegúrate de que la 'fila' tenga la propiedad 'itemsList'.
    // this.itemSeleccionado.set(fila); // este es para cuando ya este funcionando el api

    this.itemSeleccionado.set(this.inspeccionDePrueba); // este para pruebas
    console.log('Inspección seleccionada:', this.inspeccionDePrueba);
    console.log('Inspección seleccionada:', fila);
  }
}
