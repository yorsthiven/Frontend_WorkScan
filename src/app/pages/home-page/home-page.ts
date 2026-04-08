import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-home-page',
  imports: [NgIconComponent, DatePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

  ultimasInspecciones = [
    {
      id: 1,
      titulo: 'Inspección de seguridad en el sitio de construcción',
      fecha: '2024-06-01',
      estado: 'Completada'
    },
    {
      id: 1,
      titulo: 'Inspección de seguridad en el sitio de construcción',
      fecha: '2024-06-01',
      estado: 'Completada'
    },
    {
      id: 1,
      titulo: 'Inspección de seguridad en el sitio de construcción',
      fecha: '2024-06-01',
      estado: 'Completada'
    },
    {
      id: 1,
      titulo: 'Inspección de seguridad en el sitio de construcción',
      fecha: '2024-06-01',
      estado: 'Completada'
    },
    {
      id: 1,
      titulo: 'Inspección de seguridad en el sitio de construcción',
      fecha: '2024-06-01',
      estado: 'Completada'
    }
  ];
}
