import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrabajadorService } from '../../../services/trabajador/trabajador.service';
import { RouterOutlet } from '@angular/router';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-trabajador-lista',
  imports: [MaterialModules],
  templateUrl: './trabajador-lista.html',
  styleUrl: './trabajador-lista.css',
})
export class TrabajadorLista implements OnInit {

  trabajadores: any[] = [];
  columnasVisibles: string[] = ['cedula', 'nombres'];

  constructor(private trabajadorService: TrabajadorService,private cd: ChangeDetectorRef) {}

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
}
