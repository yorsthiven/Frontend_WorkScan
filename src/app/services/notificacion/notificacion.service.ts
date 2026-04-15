import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificacionComponent } from '../../components/shared/genericos/notificacion.component/notificacion.component';

@Injectable({
  providedIn: 'root', // Esto lo hace disponible en toda la app
})
export class NotificacionService {
  private snackBar = inject(MatSnackBar);

  show(tipo: 'success' | 'error' | 'warning', titulo: string, mensaje: string) {
    let icon = 'info';
    if (tipo === 'success') icon = 'check_circle';
    if (tipo === 'error') icon = 'cancel';
    if (tipo === 'warning') icon = 'warning';

    this.snackBar.openFromComponent(NotificacionComponent, {
      duration: 5000,
      data: { tipo, titulo, mensaje, icon },
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['p-0'],
    });
  }
}
