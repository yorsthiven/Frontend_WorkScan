import { ChangeDetectorRef, Component, input, OnInit, output } from '@angular/core';
import { TrabajadorService } from '../../../services/trabajador/trabajador.service';
import { MaterialModules } from '../../../shared/material.providers';
import { MatDialog } from '@angular/material/dialog';
import { TrabajadorForm } from '../trabajador-form/trabajador-form';
import { Trabajador } from '../../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-lista',
  imports: [MaterialModules],
  templateUrl: './trabajador-lista.html',
  styleUrl: './trabajador-lista.css',
})
export class TrabajadorLista {
  trabajadores = input<Trabajador[]>([]);

  // Evento para avisar al padre quién fue seleccionado
  onSeleccionar = output<Trabajador>();

  // Definimos las columnas que coinciden con tu DTO de C#
  displayedColumns: string[] = ['Cedula', 'Nombres', 'Apellidos', 'IdCargo'];

  seleccionar(trabajador: Trabajador) {
    this.onSeleccionar.emit(trabajador);
  }

}
