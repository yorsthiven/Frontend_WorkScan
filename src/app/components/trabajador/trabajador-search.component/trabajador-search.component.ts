import { Component, inject, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TrabajadorForm } from '../trabajador-form/trabajador-form';
import { Trabajador } from '../../../models/trabajador.model';

@Component({
  selector: 'app-trabajador-search',
  imports: [MatIcon],
  templateUrl: './trabajador-search.component.html',
  styleUrl: './trabajador-search.component.css',
})
export class TrabajadorSearchComponent {
  private dialog = inject(MatDialog);
  onSearch = output<string>();


  abrirFormulario() {
    const dialogRef = this.dialog.open(TrabajadorForm, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos para guardar en SQL:', result);
        // Aquí llamaremos al servicio para hacer el POST
      }
    });
  }

  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onSearch.emit(input.value);
  }
}
