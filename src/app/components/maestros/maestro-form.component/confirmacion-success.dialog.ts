import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MaterialModules } from '../../../shared/material.providers';

@Component({
  selector: 'app-confirmacion-success-dialog',
  standalone: true,
  imports: [MaterialModules, MatDialogContent, MatDialogActions],
  template: `
    <mat-dialog-content class="!p-0">
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <mat-icon class="!text-6xl !w-16 !h-16 text-green-500">check_circle</mat-icon>
          </div>
        </div>
        
        <h2 class="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">
          ¡Éxito!
        </h2>
        
        <p class="text-sm text-green-600 font-bold mb-6 uppercase tracking-wider">
          Ítem Creado Correctamente
        </p>

        @if (data.itemInfo) {
        <div class="bg-white p-4 rounded-xl border-2 border-green-200 space-y-3 text-left mb-6">
          @if (data.itemInfo.nombre) {
          <div class="flex items-center gap-3">
            <mat-icon class="text-blue-500">label</mat-icon>
            <div class="flex-1">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Nombre</p>
              <p class="text-sm font-bold text-slate-700">{{ data.itemInfo.nombre }}</p>
            </div>
          </div>
          }
          
          @if (data.itemInfo.material) {
          <div class="flex items-center gap-3">
            <mat-icon class="text-amber-500">category</mat-icon>
            <div class="flex-1">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Material</p>
              <p class="text-sm font-bold text-slate-700">{{ data.itemInfo.material }}</p>
            </div>
          </div>
          }
          
          @if (data.itemInfo.medidas) {
          <div class="flex items-center gap-3">
            <mat-icon class="text-purple-500">straighten</mat-icon>
            <div class="flex-1">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Medidas</p>
              <p class="text-sm font-bold text-slate-700">{{ data.itemInfo.medidas }}</p>
            </div>
          </div>
          }
        </div>
        }
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="center" class="!p-6 bg-slate-50 border-t border-slate-200">
      <button 
        mat-flat-button 
        color="primary"
        (click)="cerrar()"
        class="!rounded-xl !px-8 !h-[45px] shadow-lg shadow-green-200">
        <mat-icon class="mr-2">done</mat-icon>
        Entendido
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmacionSuccessDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmacionSuccessDialog>
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}
