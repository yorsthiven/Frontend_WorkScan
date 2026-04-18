import { NavbarLandingComponent } from '../../navbar-landing-component/navbar-landing-component';
import { Component } from '@angular/core';
import { HeroLandingComponent } from '../../hero-landing-component/hero-landing-component';
import { FeaturesLandingComponent } from "../../features-landing-component/features-landing-component";
import { FooterLandingComponent } from "../../footer-landing-component/footer-landing-component";

@Component({
  selector: 'app-landing-component',
  imports: [NavbarLandingComponent, HeroLandingComponent, FeaturesLandingComponent, FooterLandingComponent],
  templateUrl: './landing-component.html',
})
export class LandingComponent {

}
