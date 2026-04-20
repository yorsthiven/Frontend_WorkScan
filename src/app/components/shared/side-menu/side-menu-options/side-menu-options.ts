import { Component, OnInit } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { dashboardRoutes } from '../../../../dashboard/dashboard.routes';

interface MenuOpciones {
  titulo: string;
  parrafo?: string;
  route: string;
  icono?: string;
}

@Component({
  selector: 'app-side-menu-options',
  imports: [NgIconComponent, RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.html',
})
export class SideMenuOptions implements OnInit {
  dashboardMenu: MenuOpciones[] = [];

  ngOnInit() {
    const dashboardItems = dashboardRoutes.find((r) => r.path === '')?.children ?? [];

    this.dashboardMenu = dashboardItems
      .filter((item) => item.path !== '**')
      .map((item) => ({
        titulo: item.data?.['titulo'] ?? '',
        parrafo: item.data?.['parrafo'] ?? '',
        route: `/dashboard/${item.path}`,
        icono: item.data?.['icono'] ?? 'bootstrapHouse',
      }))
      .sort((a, b) => {
        if (a.titulo === 'Principal') return -1;
        if (b.titulo === 'Principal') return 1;
        return a.titulo.localeCompare(b.titulo);
      });
  }

  opciones: MenuOpciones[] = [
    {
      titulo: 'Principal',
      parrafo: 'Visión general de tus datos y métricas clave.',
      route: '/dashboard/home',
      icono: 'bootstrapHouse',
    },
    {
      titulo: 'Trabajadores',
      parrafo: 'Gestiona la información y documentos de tus trabajadores.',
      route: '/dashboard/trabajadores',
      icono: 'heroWrenchScrewdriverSolid',
    },
    {
      titulo: 'Usuarios',
      parrafo: 'Gestiona la información y documentos de tus usuarios.',
      route: '/dashboard/usuarios',
      icono: 'heroUser',
    },
    {
      titulo: 'Maestros',
      parrafo: 'Gestiona la información sobre los diferentes maestros.',
      route: '/dashboard/maestros',
      icono: 'ionBuild',
    },
  ];
}
