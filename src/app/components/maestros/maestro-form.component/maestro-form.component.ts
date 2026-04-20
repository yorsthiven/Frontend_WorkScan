import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { FormsModules } from '../../../shared/shared-forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatLabel } from "@angular/material/input";

@Component({
  selector: 'app-maestro-form',
  imports: [MatDialogContent, MatFormField, MatLabel, MatDialogActions,MaterialModules,FormsModules],
  templateUrl: './maestro-form.component.html',
})
export class MaestroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MaestroFormComponent>);

  form!: FormGroup;
  titulo: string;
  campos: string[]; // ['nombre', 'material'] o ['nombre', 'descripcion']

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.titulo = data.titulo;
    this.campos = data.campos;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const group: any = {
      id: [this.data.elemento?.id || 0],
    };

    // Creamos dinámicamente los campos que nos pidió el padre
    this.campos.forEach((campo) => {
      group[campo] = [this.data.elemento?.[campo] || '', Validators.required];
    });

    this.form = this.fb.group(group);
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
