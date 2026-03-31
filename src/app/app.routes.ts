import { Routes } from '@angular/router';
import { TrabajadorLista } from './components/trabajador/trabajador-lista/trabajador-lista';

export const routes: Routes = [
  {
    path: 'trabajadores',
    component: TrabajadorLista
  },
  {
    path: '',
    redirectTo: 'trabajadores',
    pathMatch: 'full'
  }
];
