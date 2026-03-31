import { MaterialModules } from './../../../shared/material.providers';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModules } from '../../../shared/shared-forms';

@Component({
  selector: 'app-trabajador-form',
  imports: [MaterialModules, FormsModules],
  templateUrl: './trabajador-form.html',
  styleUrl: './trabajador-form.css',
})
export class TrabajadorForm {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrabajadorForm>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      // apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      // cargo: ['', [Validators.required]],
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
