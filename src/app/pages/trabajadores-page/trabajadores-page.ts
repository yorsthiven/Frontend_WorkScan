import { Component } from '@angular/core';
import { TrabajadorLista } from "../../components/trabajador/trabajador-lista/trabajador-lista";

@Component({
  selector: 'app-trabajadores-page',
  imports: [TrabajadorLista],
  templateUrl: './trabajadores-page.html',
  styleUrl: './trabajadores-page.css',
})
export class TrabajadoresPage {

}
