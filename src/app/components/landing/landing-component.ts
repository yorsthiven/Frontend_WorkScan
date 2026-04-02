import { Component } from '@angular/core';
import { NavbarLandingComponent } from './navbar-landing-component/navbar-landing-component';
import { HeroLandingComponent } from './hero-landing-component/hero-landing-component';

@Component({
  selector: 'app-landing-component',
  imports: [NavbarLandingComponent,HeroLandingComponent],
  templateUrl: './landing-component.html',
  styleUrl: './landing-component.css',
})
export class LandingComponent {

}
