import { Component, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Trabajador } from '../../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-detalle',
  imports: [],
  templateUrl: './trabajador-detalle.component.html',
})
export class TrabajadorDetalleComponent {
  trabajadorDetallado = input<Trabajador | null>(null);
}
