import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { TrabajadorLista } from '../../components/trabajador/trabajador-lista/trabajador-lista';
import { TrabajadorSearchComponent } from '../../components/trabajador/trabajador-search.component/trabajador-search.component';
import { TrabajadorTarjetasComponent } from '../../components/trabajador/trabajador-tarjetas.component/trabajador-tarjetas.component';
import { TrabajadorDetalleComponent } from '../../components/trabajador/trabajador-detalle.component/trabajador-detalle.component';
import { TrabajadorService } from '../../services/trabajador/trabajador.service';
import { Trabajador } from '../../models/trabajador.model';
import { ListaGenericaComponent } from "../../components/shared/genericos/lista-generica.component/lista-generica.component";
import { SearchGenericoComponent } from "../../components/shared/genericos/search-generico.component/search-generico.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-trabajadores-page',
  imports: [
    TrabajadorLista,
    TrabajadorSearchComponent,
    TrabajadorTarjetasComponent,
    TrabajadorDetalleComponent,
    ListaGenericaComponent,
    SearchGenericoComponent,
    MatIcon
],
  templateUrl: './trabajadores-page.html',
})
export class TrabajadoresPage {
  private trabajadorService = inject(TrabajadorService);

  trabajadores = signal<Trabajador[]>([]);
  trabajadorSeleccionado = signal<Trabajador | null>(null);
  mostrarFormulario= signal(false);

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
        console.error('Error al conectar con .NET:', err);
        this.trabajadores.set([]); // <--- Esto fuerza a la tabla a mostrar el mensaje de "No encontrado"
      },
    });
  }

  seleccionarTrabajador(t: Trabajador) {
    this.trabajadorSeleccionado.set(t);
  }

  abrirFormulario() {
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
  }

  // Este método lo llamarás cuando el formulario termine de guardar con éxito
  onTrabajadorGuardado(nuevoTrabajador: Trabajador) {
    console.log('Trabajador registrado:', nuevoTrabajador);
    // Aquí puedes refrescar la lista o agregar el nuevo al array
    this.cerrarFormulario();
  }
}
