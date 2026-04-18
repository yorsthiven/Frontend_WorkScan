import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
import { SideMenu } from '../side-menu-page/side-menu';
// import { RouterOutlet } from "../../../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-dashboard-page',
  imports: [SideMenu, RouterOutlet, MatIcon],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  menuOpen = false; // Controla el estado en móvil

  constructor(router: Router) {
    router.events.subscribe(() => {
      this.menuOpen = false;
    });
  }
}
