import { Routes } from '@angular/router';
import { TrabajadorLista } from './components/trabajador/trabajador-lista/trabajador-lista';
import { LoginComponent } from './components/auth/login-component/login-component';
import { LandingComponent } from './components/landing/landing-component';

export const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'trabajadores',
    component: TrabajadorLista
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
