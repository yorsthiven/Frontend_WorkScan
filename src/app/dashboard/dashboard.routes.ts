import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { HomePage } from './pages/home-page/home-page';
import { TrabajadoresPage } from './pages/trabajadores-page/trabajadores-page';
import { UsuariosPage } from './pages/usuarios-page/usuarios-page';
import { ConfiguracionComponent } from '../components/maestros/maestros-page/maestros-page';
import { SintomatologiaComponent } from './pages/sintomatologia-component/sintomatologia.component';
import { InspeccionesPage } from './pages/inspecciones-page/inspecciones-page';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        component: HomePage,
        data: {
          titulo: 'Principal',
          parrafo: 'Principal',
          icono: 'bootstrapHouse',
        }
      },
      {
        path: 'trabajadores',
        component: TrabajadoresPage,
        data: {
          titulo: 'Trabajadores',
          parrafo: 'Gestiona la información y documentos de tus trabajadores.',
          icono: 'heroWrenchScrewdriverSolid',
        }
      },
      {
        path: 'usuarios',
        component: UsuariosPage,
        data: {
          titulo: 'Usuarios',
          parrafo: 'Gestiona la información y documentos de tus usuarios.',
          icono: 'heroUser',
        }
      },
      {
        path: 'maestros',
        component: ConfiguracionComponent,
        data: {
          titulo: 'Maestros',
          parrafo: 'Gestiona la información sobre los diferentes maestros.',
          icono: 'ionBuild',
        }
      },
      {
        path:'inspecciones',
        // component: InspeccionesPage,
        data: {
          titulo: 'Inspecciones',
          parrafo: 'Gestiona las inspecciones del trabajador.',
          icono: 'heroTableCells',
        },
        loadChildren: () => import('./pages/inspecciones-page/inspeccion.routes').then(m => m.inspeccionRoutes)
      },
      {
        path: '**',
        redirectTo: 'home'
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

// export default dashboardRoutes;
