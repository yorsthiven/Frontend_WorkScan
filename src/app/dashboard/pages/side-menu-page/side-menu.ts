import { Component, inject } from '@angular/core';
import { SideMenuHeader } from '../../../components/shared/side-menu/side-menu-header/side-menu-header';
import { SideMenuOptions } from '../../../components/shared/side-menu/side-menu-options/side-menu-options';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/login/AuthService';
import { Router } from '@angular/router';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-side-menu',
  imports: [SideMenuHeader, SideMenuOptions,MaterialModules],
  templateUrl: './side-menu.html',
  // styleUrl: './side-menu.css',
})
export class SideMenu {
  private _authService = inject(AuthService);

  private _router = inject(Router);

  cerrarSesion() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que ingresar tus credenciales nuevamente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._authService.logout();
        this._router.navigate(['/auth/login']);
      }
    });
  }
}
