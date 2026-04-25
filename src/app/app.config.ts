import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appIcons } from './shared/icons.provider';
import { authInterceptor } from './shared/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // Restaura el scroll al navegar
        anchorScrolling: 'enabled'            // ¡ESTO habilita el #id!
      })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    appIcons
  ]
};
