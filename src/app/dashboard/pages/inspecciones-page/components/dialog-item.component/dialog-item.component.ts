import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModules } from '../../../../../shared/material.providers';

@Component({
  selector: 'app-dialog-item.component',
  imports: [MaterialModules, ReactiveFormsModule],
  templateUrl: './dialog-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemComponent {
  private _fb = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<DialogItemComponent>);

  // Formulario para el ItemRegistroDto
  itemForm = this._fb.group({
    idItem: [null, Validators.required],
    nombre: ['', Validators.required],
    material: [''],
    alto: [0],
    ancho: [0],
    largo: [0],
    pulgada: [0],
    hallazgos: [[] as string[]],
    recomendaciones: [[] as string[]],
  });

  fotos = signal<string[]>([]); // Almacenará las imágenes en Base64

  // Manejador de archivos (Fotos)
  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fotos.update((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  guardar() {
    if (this.itemForm.valid) {
      const resultado = {
        ...this.itemForm.value,
        fotos: this.fotos(),
      };
      this._dialogRef.close(resultado);
    }
  }

  cancelar() {
    this._dialogRef.close();
  }
}
