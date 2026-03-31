import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../../services/trabajador/trabajador.service';
import { MaterialModules } from '../../../shared/material.providers';
import { MatDialog } from '@angular/material/dialog';
import { TrabajadorForm } from '../trabajador-form/trabajador-form';

@Component({
  selector: 'app-trabajador-lista',
  imports: [MaterialModules],
  templateUrl: './trabajador-lista.html',
  styleUrl: './trabajador-lista.css',
})
export class TrabajadorLista implements OnInit {
  trabajadores: any[] = [];
  columnasVisibles: string[] = ['cedula', 'nombres'];

  constructor(
    private trabajadorService: TrabajadorService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.trabajadorService.getTrabajadores().subscribe({
      next: (data) => {
        this.trabajadores = data;
        this.cd.detectChanges();
        console.log('Trabajadores:', data);
      },
      error: (error) => {
        console.error('Error al obtener trabajadores:', error);
      },
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(TrabajadorForm, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos para guardar en SQL:', result);
        // Aquí llamaremos al servicio para hacer el POST
      }
    });
  }
}
