import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing-page/landing-component';

export const landingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'landing',
        component: LandingComponent,
      },
      {
        path: '**',
        redirectTo: 'landing',
      },
    ],
  },
];

// export default landingRoutes;
