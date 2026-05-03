import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { MaterialModules } from '../../../shared/material.providers';
import { EnConstruccion } from "../../../components/en-construccion/en-construccion";

@Component({
  selector: 'app-home-page',
  imports: [NgIconComponent, DatePipe, MaterialModules, EnConstruccion],
  templateUrl: './home-page.html',
})
export class HomePage {

  moduloNoListo = true;
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
