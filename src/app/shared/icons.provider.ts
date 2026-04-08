import { bootstrapFacebook, bootstrapHouse, bootstrapInstagram, bootstrapLinkedin } from '@ng-icons/bootstrap-icons';
// icons.config.ts
import { provideIcons } from '@ng-icons/core';
import { heroClipboardDocumentCheck, heroShieldCheck, heroChartBar, heroHome, heroUser, heroArrowLeftOnRectangle } from '@ng-icons/heroicons/outline';
import { heroArrowLeftOnRectangleSolid, heroArrowUpSolid, heroClipboardDocumentCheckSolid, heroUsersSolid, heroWrenchScrewdriverSolid } from '@ng-icons/heroicons/solid';

// Exportas una constante con la configuración
export const appIcons = provideIcons({
  heroClipboardDocumentCheck,
  heroShieldCheck,
  heroChartBar,
  bootstrapFacebook,
  bootstrapInstagram,
  bootstrapLinkedin,
  bootstrapHouse,
  heroHome,
  heroWrenchScrewdriverSolid,
  heroUser,
  heroUsersSolid,
  heroArrowUpSolid,
  heroClipboardDocumentCheckSolid,
  heroArrowLeftOnRectangle,
  heroArrowLeftOnRectangleSolid

});
