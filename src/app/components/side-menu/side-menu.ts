import { Component } from '@angular/core';
import { SideMenuHeader } from './side-menu-header/side-menu-header';
import { SideMenuOptions } from "./side-menu-options/side-menu-options";
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-side-menu',
  imports: [SideMenuHeader, SideMenuOptions,NgIconComponent],
  templateUrl: './side-menu.html',
  // styleUrl: './side-menu.css',
})
export class SideMenu {

}
