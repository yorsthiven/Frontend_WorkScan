import { Component } from '@angular/core';
import { SideMenu } from "../../components/side-menu/side-menu";
import { RouterOutlet } from '@angular/router';
// import { RouterOutlet } from "../../../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-dashboard-page',
  imports: [SideMenu, RouterOutlet],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {

}
