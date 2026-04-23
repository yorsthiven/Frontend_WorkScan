import { InspeccionRegistroComponent } from './components/inspeccion-registro.component/inspeccion-registro.component';
import { InspeccionesPage } from './inspecciones-page';

export const inspeccionRoutes = [
  {
    path: '',
    component: InspeccionesPage,
  },
  {
    path: 'registro',
    component: InspeccionRegistroComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
