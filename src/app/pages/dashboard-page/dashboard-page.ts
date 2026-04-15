import { Component } from '@angular/core';
import { SideMenu } from '../../components/side-menu/side-menu';
import { Router, RouterOutlet } from '@angular/router';
import { MatIcon } from "@angular/material/icon";
// import { RouterOutlet } from "../../../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-dashboard-page',
  imports: [SideMenu, RouterOutlet, MatIcon],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  menuOpen = false; // Controla el estado en móvil

  constructor(router: Router) {
    router.events.subscribe(() => {
      this.menuOpen = false;
    });
  }
}
