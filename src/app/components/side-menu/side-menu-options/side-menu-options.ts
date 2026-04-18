import { Component } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuOpciones{
  nombre: string;
  parrafo: string;
  route: string;
  icono: string;
}

@Component({
  selector: 'app-side-menu-options',
  imports: [NgIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.html',
  styleUrl: './side-menu-options.css',
})
export class SideMenuOptions {

  opciones: MenuOpciones[] = [
    {
      nombre: 'Principal',
      parrafo: 'Visión general de tus datos y métricas clave.',
      route: '/dashboard/home',
      icono: 'bootstrapHouse'
    },
    {
      nombre: 'Trabajadores',
      parrafo: 'Gestiona la información y documentos de tus trabajadores.',
      route: '/dashboard/trabajadores',
      icono: 'heroWrenchScrewdriverSolid'
    },
    {
      nombre: 'Usuarios',
      parrafo: 'Gestiona la información y documentos de tus usuarios.',
      route: '/dashboard/usuarios',
      icono: 'heroUser'
    },
    {
      nombre: 'Maestros',
      parrafo: 'Gestiona la información sobre los diferentes maestros.',
      route: '/dashboard/configuracion',
      icono: 'ionBuild'
    }
  ];
}
