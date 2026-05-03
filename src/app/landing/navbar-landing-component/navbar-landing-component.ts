import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModules } from '../../shared/material.providers';

@Component({
  selector: 'app-navbar-landing',
  imports: [RouterLink, MaterialModules],
  templateUrl: './navbar-landing-component.html',
  styleUrl: './navbar-landing-component.css',
})
export class NavbarLandingComponent {

}
