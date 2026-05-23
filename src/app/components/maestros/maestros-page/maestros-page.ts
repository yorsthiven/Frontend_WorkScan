import { Component, inject, signal } from '@angular/core';
import { TablaMaestraComponent } from '../tabla-maestra.component/tabla-maestra.component';
import { MaestroService } from '../../../services/maestro/maestro.service';
import { MatDialog } from '@angular/material/dialog';
import { MaestroFormComponent } from '../maestro-form.component/maestro-form.component';
import { MaterialModules } from '../../../shared/material.providers';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [TablaMaestraComponent, MaterialModules],
  templateUrl: './maestros-page.html',
})
export class ConfiguracionComponent {
  private maestrosService = inject(MaestroService);
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.cargarTodosLosMaestros();
  }

  listaItems = signal<any[]>([]);
  listaJornadas = signal<any[]>([]);
  listaCargos = signal<any[]>([]);
  listaEmpresas = signal<any[]>([]);

  cargarTodosLosMaestros() {
    this.maestrosService.getMaestro('Item').subscribe((res) => {
      this.listaItems.set(res);
    });

    this.maestrosService.getMaestro('Jornada').subscribe((res) => {
      this.listaJornadas.set(res);
    });
    this.maestrosService.getMaestro('Cargo').subscribe((res) => {
      this.listaCargos.set(res);
    });
    this.maestrosService.getMaestro('Empresa').subscribe((res) => {
      this.listaEmpresas.set(res);
    });
  }

  // ===== ITEMS =====
  agregarItem() {
    this.abrirModal('Item', ['nombre', 'material','alto','largo','ancho', 'pulgada']);
  }

  editarItem(item: any) {
    this.abrirModal('Item', ['nombre', 'material','alto','largo','ancho', 'pulgada'], item);
  }

  eliminarItem(item: any) {
    this.confirmarEliminar('Item', item);
  }

  // ===== JORNADAS =====
  agregarJornada() {
    this.abrirModal('Jornada', ['nombreJornada']);
  }

  editarJornada(jornada: any) {
    this.abrirModal('Jornada', ['nombreJornada'], jornada);
  }

  eliminarJornada(jornada: any) {
    this.confirmarEliminar('Jornada', jornada);
  }

  // ===== CARGOS =====
  agregarCargo() {
    this.abrirModal('Cargo', ['nombreCargo']);
  }

  editarCargo(cargo: any) {
    this.abrirModal('Cargo', ['nombreCargo'], cargo);
  }

  eliminarCargo(cargo: any) {
    this.confirmarEliminar('Cargo', cargo);
  }

  // ===== EMPRESAS =====
  agregarEmpresa() {
    this.abrirModal('Empresa', ['nombreEmpresa']);
  }

  editarEmpresa(empresa: any) {
    this.abrirModal('Empresa', ['nombreEmpresa'], empresa);
  }

  eliminarEmpresa(empresa: any) {
    this.confirmarEliminar('Empresa', empresa);
  }

  // ===== MÉTODOS AUXILIARES =====
  private abrirModal(maestro: string, campos: string[], elemento?: any) {
    // Determinar el ancho dinámicamente según la cantidad de campos
    let width = '400px';
    if (campos.length === 1) {
      width = '450px';
    } else if (campos.length >= 2) {
      width = '650px';
    }

    const dialogRef = this.dialog.open(MaestroFormComponent, {
      width: width,
      maxWidth: '90vw',
      data: {
        titulo: elemento ? `Editar ${maestro}` : `Nuevo ${maestro}`,
        campos: campos,
        elemento: elemento,
      },
    });

    // console.log("dialogRef: ",dialogRef);
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log("resultado: ",resultado);
        const isEdit = !!elemento;
        this.maestrosService.guardarMaestro(maestro, resultado, isEdit).subscribe({
          next: () => {
            Swal.fire(
              '¡Éxito!',
              `${maestro} ${isEdit ? 'actualizado' : 'creado'} correctamente`,
              'success',
            );
            this.cargarTodosLosMaestros();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              `No se pudo ${isEdit ? 'actualizar' : 'crear'} el ${maestro}`,
              'error',
            );
          },
        });
      }
    });
  }

  private confirmarEliminar(maestro: string, elemento: any) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `¿Estás seguro de que deseas eliminar este ${maestro.toLowerCase()}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        this.maestrosService.eliminarMaestro(maestro, elemento.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', `${maestro} eliminado correctamente`, 'success');
            this.cargarTodosLosMaestros();
          },
          error: (err) => {
            Swal.fire('Error', `No se pudo eliminar el ${maestro}`, 'error');
          },
        });
      }
    });
  }
}
