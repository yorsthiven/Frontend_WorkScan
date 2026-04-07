import { bootstrapFacebook, bootstrapInstagram, bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
// icons.config.ts
import { provideIcons } from '@ng-icons/core';
import { heroClipboardDocumentCheck, heroShieldCheck, heroChartBar } from '@ng-icons/heroicons/outline';

// Exportas una constante con la configuración
export const appIcons = provideIcons({
  heroClipboardDocumentCheck,
  heroShieldCheck,
  heroChartBar,
  bootstrapFacebook,
  bootstrapInstagram,
  bootstrapLinkedin
});
