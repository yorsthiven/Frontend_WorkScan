import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { TrabajadorLista } from '../../components/trabajador/trabajador-lista/trabajador-lista';
import { TrabajadorSearchComponent } from '../../components/trabajador/trabajador-search.component/trabajador-search.component';
import { TrabajadorTarjetasComponent } from '../../components/trabajador/trabajador-tarjetas.component/trabajador-tarjetas.component';
import { TrabajadorDetalleComponent } from '../../components/trabajador/trabajador-detalle.component/trabajador-detalle.component';
import { TrabajadorService } from '../../services/trabajador/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';
import { ListaGenericaComponent } from '../../components/shared/genericos/lista-generica.component/lista-generica.component';
import { SearchGenericoComponent } from '../../components/shared/genericos/search-generico.component/search-generico.component';
import { MatIcon } from '@angular/material/icon';
import { TrabajadorForm } from '../../components/trabajador/trabajador-form/trabajador-form';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SpinnerGenericoComponent } from "../../components/shared/genericos/spinner-generico.component/spinner-generico.component";
import { MaterialModules } from '../../shared/material.providers';

interface ItemSelect {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-trabajadores-page',
  imports: [
    MaterialModules,
    TrabajadorTarjetasComponent,
    TrabajadorDetalleComponent,
    ListaGenericaComponent,
    SearchGenericoComponent,
    SpinnerGenericoComponent
],
  templateUrl: './trabajadores-page.html',
})
export class TrabajadoresPage {
  private trabajadorService = inject(TrabajadorService);

  isLoading = signal(false);
  trabajadores = signal<Trabajador[]>([]);
  trabajadorSeleccionado = signal<Trabajador | null>(null);
  mostrarFormulario = signal(false);

  // Definimos las columnas para la lista genérica
  // IMPORTANTE: Usa los nombres en minúscula tal como vienen en el JSON
  columnasTrabajador = [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'idCargo', label: 'Cargo' },
  ];

  ngOnInit() {
    // Carga inicial (trae todos porque el filtro va vacío)
    this.filtrarTrabajadores('');
  }

  filtrarTrabajadores(termino: string) {
    this.trabajadorService.getTrabajadores(termino).subscribe({
      next: (data) => {
        this.trabajadores.set(data); // Actualiza la lista automáticamente
      },
      error: (err) => {
        this.trabajadores.set([]); // <--- Esto fuerza a la tabla a mostrar el mensaje de "No encontrado"
      },
    });
  }

  seleccionarTrabajador(t: Trabajador) {
    this.trabajadorSeleccionado.set(t);
  }

  private readonly dialog = inject(MatDialog);

  abrirFormulario() {
    this.mostrarFormulario.set(true);

    const dialogRef = this.dialog.open(TrabajadorForm, {
      width: '95vw', // Ocupa el 95% del ancho de la vista, dejando un margen pequeño
      maxWidth: '650px',
      panelClass: 'custom-modal-container',
      autoFocus: false, // Evita que el teclado salte de golpe en móvil
      // AQUÍ PASAS LA INFORMACIÓN
      data: {
        cargos: this.listaCargos(), // tus señales o variables
        jornadas: this.listaJornadas(),
        // roles: this.listaRoles(),
      },
    });
    // Aquí recibimos el "res" que mandamos en el dialogRef.close(res)
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        console.log('Recibido desde el modal:', resultado);
        // El trabajador se guardó, ahora actualizamos la lista principal
        this.filtrarTrabajadores('');
        // O puedes agregarlo manualmente al array para no recargar todo:
        // this.listaTrabajadores.update(list => [...list, nuevoTrabajador]);
      }
    });
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
  }

  // Este método lo llamarás cuando el formulario termine de guardar con éxito
  onTrabajadorGuardado(nuevoTrabajador: Trabajador) {
    // Aquí puedes refrescar la lista o agregar el nuevo al array
    this.trabajadorService.crearTrabajador(nuevoTrabajador).subscribe();
    this.cerrarFormulario();
  }

  // Estos arreglos simulan lo que llegará de tu base de datos .NET
  listaCargos = signal<ItemSelect[]>([
    { id: 1, nombre: 'Desarrollador' },
    { id: 2, nombre: 'Especialista SST' },
    { id: 3, nombre: 'Médico Laboral' },
  ]);

  listaJornadas = signal<ItemSelect[]>([
    { id: 1, nombre: 'Diurna' },
    { id: 2, nombre: 'Nocturna' },
    { id: 3, nombre: 'Mixta' },
  ]);

  roles = signal<ItemSelect[]>([
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Usuario Estándar' },
  ]);
}
