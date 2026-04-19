import { Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../tabla-maestra.component/tabla-maestra.component';
import { MaestroService } from '../../../services/maestro/maestro.service';
import { MatDialog } from '@angular/material/dialog';
import { MaestroFormComponent } from '../maestro-form.component/maestro-form.component';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-configuracion',
  imports: [TablaMaestraComponent,MaterialModules],
  templateUrl: './maestros-page.html',
})
export class ConfiguracionComponent {
  private maestrosService = inject(MaestroService);
  private readonly dialog = inject(MatDialog);

  /**
   *
   */
  constructor() {
    this.cargarTodosLosMaestros();
  }

  // Simulando datos (luego vendrán de tus servicios)
  listaItems = signal([
    { id: 1, nombre: 'Guantes', material: 'Látex' },
    { id: 1, nombre: 'Guantes', material: 'Látex' },
  ]);
  listaDolores = signal([{ id: 1, nombre: 'Agudo', descripcion: 'Dolor punzante' }]);

  agregarItem() {
    console.log('Abriendo modal Item...');
  }
  editarItem(item: any) {
    console.log('Editando:', item);
  }

  listaJornadas = signal([{}]);
  listaCargos = signal([{}]);
  listaEmpresas = signal([{}]);

  cargarTodosLosMaestros() {
    // Cargamos cada tabla usando el mismo servicio pero diferente endpoint
    this.maestrosService.getMaestro('Item').subscribe((res) => {
      console.log("items",res);
      this.listaItems.set(res);
    });

    this.maestrosService.getMaestro('Jornada').subscribe((res) => {this.listaJornadas.set(res), console.log("Jornadas",res);});
    this.maestrosService.getMaestro('Cargo').subscribe((res) => {this.listaCargos.set(res), console.log("cargos",res);});
    this.maestrosService.getMaestro('Empresa').subscribe((res) =>{this.listaEmpresas.set(res), console.log("empresas",res);});
  }

  abrirModal(maestro: string, campos: string[], elemento?: any) {
    const dialogRef = this.dialog.open(MaestroFormComponent, {
      width: '400px',
      data: {
        titulo: elemento ? `Editar ${maestro}` : `Nuevo ${maestro}`,
        campos: campos,
        elemento: elemento,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        // Aquí llamas a tu MaestrosService pasándole el 'endpoint'
        const isEdit = !!elemento;
        this.maestrosService.guardarMaestro(maestro, resultado, isEdit).subscribe(() => {
          this.cargarTodosLosMaestros(); // Recargamos la tabla
        });
      }
    });
  }
}
