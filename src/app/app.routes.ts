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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then(m => m.DashboardPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage)
      },
      {
        path: 'trabajadores',
        loadComponent: () => import('./pages/trabajadores-page/trabajadores-page').then(m => m.TrabajadoresPage)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios-page/usuarios-page').then(m => m.UsuariosPage)
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },
  {
    path: 'trabajadoresLista',
    component: TrabajadorLista
  },
  {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
