import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sintomatologia-component',
  imports: [MaterialModules],
  templateUrl: './sintomatologia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SintomatologiaComponent {
  // 1. Diccionario privado con el catálogo oficial de tipos de dolor de WorkScan
  private readonly CATALOGO_DOLORES: Record<number, string> = {
    1: 'Sin dolor',
    2: 'Agudo',
    3: 'Crónico',
    4: 'Nociceptivo',
    5: 'Neuropático',
    6: 'Inflamatorio',
    7: 'Mecánico',
    8: 'Referido',
    9: 'Punzante',
    10: 'Opresivo',
    11: 'Constante',
  };
  // Recibe la inspección seleccionada
  // datos = input.required<any>();
  datosInput = input.required<any>({ alias: 'datos' });

  // Calculamos el porcentaje para la barra EVA (0-10)
  evaPercentage = computed(() => {
    const valor = this.datos()?.calificacionEva || 0;
    return valor * 10 + '%';
  });

  getEvaColor(valor: number): string {
    if (valor <= 1) return '#22c55e'; // Verde
    if (valor <= 3) return '#eab308'; // Amarillo
    if (valor <= 7) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  }

  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });
  public dialogRef = inject(MatDialogRef, { optional: true });

  // 2. Si hay datos de diálogo, los usamos; si no, usamos el input normal
  // Esto permite que el componente siga funcionando como lo tienes ahora
  // datosInput = input<any>();

  datos = computed(() => {
    return this.dialogData || this.datosInput();
  });

  // 2. Nueva señal computada para traducir el ID numérico a texto legible
  tipoDolorTexto = computed(() => {
    const idDolor = this.datos()?.tipoDolor;
    if (!idDolor) return 'No especificado';

    // Retorna el nombre si existe en el catálogo; de lo contrario, "No especificado"
    return this.CATALOGO_DOLORES[idDolor] || 'No especificado';
  });
  private dialog = inject(MatDialog);
  estaExpandido = signal(false);

  toggleExpansion() {
    // Solo permitimos colapsar/expandir si NO estamos en el modal
    if (!this.dialogRef) {
      this.estaExpandido.update((v) => !v);
    }
  }

  abrirDetalle(event: Event) {
    event.stopPropagation();
    this.dialog.open(SintomatologiaComponent, {
      data: this.datos(),
      width: '90vw', // 90% del ancho de pantalla
      maxWidth: '100vh',
      height: '60vh',
      maxHeight: '90vh', // 90% del alto
      panelClass: 'modal-fullscreen-custom',
    });
  }
}
