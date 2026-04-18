import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { SideMenuHeader } from '../../../components/shared/side-menu/side-menu-header/side-menu-header';
import { SideMenuOptions } from '../../../components/shared/side-menu/side-menu-options/side-menu-options';

@Component({
  selector: 'app-side-menu',
  imports: [SideMenuHeader, SideMenuOptions,NgIconComponent],
  templateUrl: './side-menu.html',
  // styleUrl: './side-menu.css',
})
export class SideMenu {

}
