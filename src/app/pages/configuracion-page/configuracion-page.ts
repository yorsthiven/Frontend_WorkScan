import { Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { MaestroService } from '../../services/maestro/maestro.service';
import { MatDialog } from '@angular/material/dialog';
import { MaestroFormComponent } from '../../components/maestros/maestro-form.component/maestro-form.component';

@Component({
  selector: 'app-configuracion',
  imports: [TablaMaestraComponent],
  templateUrl: './configuracion-page.html',
})
export class ConfiguracionComponent {
  private maestrosService = inject(MaestroService);
  private readonly dialog = inject(MatDialog);

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

  cargarTodosLosMaestros() {
    // Cargamos cada tabla usando el mismo servicio pero diferente endpoint
    this.maestrosService.getMaestro('listaItems').subscribe((res) => this.listaItems.set(res));
    // this.maestrosService.getMaestro('Dolores').subscribe((res) => this.dolores.set(res));
    // this.maestrosService.getMaestro('TiposDolor').subscribe((res) => this.tiposDolor.set(res));
    // this.maestrosService.getMaestro('EscalaEva').subscribe((res) => this.escalasEva.set(res));
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
