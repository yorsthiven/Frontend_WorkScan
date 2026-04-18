import { Routes } from '@angular/router';
import { TrabajadorLista } from './components/trabajador/trabajador-lista/trabajador-lista';
// import { LandingComponent } from './components/landing/landing-component';
import { ConfiguracionComponent } from './dashboard/pages/configuracion-page/configuracion-page';

export const routes: Routes = [
  {
    path: 'home',
    // component: LandingComponent,
    loadChildren: () => import('./landing/landing.routes').then((m) => m.landingRoutes), //ejemplo cuando no es exporta por defecto un modulo de routes
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'), // asi es cuando el archivo de roues exopport por defecto, no hay que agregarle nada mas
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
  },
  {
    path: 'trabajadoresLista',
    component: TrabajadorLista,
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
