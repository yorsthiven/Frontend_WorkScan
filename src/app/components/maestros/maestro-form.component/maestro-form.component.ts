import { Component, Inject, inject, OnInit } from '@angular/core';
import { MaterialModules } from '../../../shared/material.providers';
import { FormsModules } from '../../../shared/shared-forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatFormField } from "@angular/material/input";

@Component({
  selector: 'app-maestro-form',
  imports: [MatDialogContent, MatFormField, MatDialogActions, MaterialModules, FormsModules],
  templateUrl: './maestro-form.component.html',
  styles: [`
    :host ::ng-deep {
      .mat-mdc-dialog-container {
        border-radius: 2rem !important;
        background: white !important;
      }

      .maestro-form-header {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
        border-bottom: 2px solid #e0e7ff;
      }

      .maestro-form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .maestro-form-field mat-form-field {
        width: 100%;
      }

      .maestro-form-label {
        font-weight: 800;
        color: #334155;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .maestro-form-label mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .maestro-form-footer {
        background: linear-gradient(135deg, #f1f5f9 0%, #f0f9ff 100%) !important;
        border-top: 2px solid #e2e8f0;
      }

      .maestro-form-btn-cancel {
        border-radius: 0.75rem !important;
        border: 2px solid #cbd5e1 !important;
        color: #475569 !important;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.75rem;
        padding: 0 1.5rem !important;
        height: 45px !important;
        transition: all 0.3s ease !important;

        &:hover {
          border-color: #94a3b8 !important;
          background-color: #f1f5f9 !important;
        }
      }

      .maestro-form-btn-save {
        border-radius: 0.75rem !important;
        background-color: #3b82f6 !important;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3) !important;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 0.75rem;
        padding: 0 2rem !important;
        height: 45px !important;
        transition: all 0.3s ease !important;

        &:hover:not(:disabled) {
          background-color: #2563eb !important;
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4) !important;
          transform: translateY(-2px);
        }

        &:disabled {
          background-color: #cbd5e1 !important;
          cursor: not-allowed !important;
          opacity: 0.6 !important;
        }
      }

      .maestro-form-error {
        color: #ef4444 !important;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.25rem;
      }

      mat-form-field.mat-focused .mat-form-field-label {
        color: #3b82f6 !important;
      }

      .mdc-text-field--filled .mdc-text-field__input {
        background-color: #f8fafc !important;
      }
    }
  `],
})
export class MaestroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MaestroFormComponent>);
  private matDialog = inject(MatDialog);

  form!: FormGroup;
  titulo: string;
  campos: string[]; // ['nombre', 'material'] o ['nombre', 'descripcion']

  // Mapa de etiquetas para mostrar en español
  private labelMap: { [key: string]: string } = {
    'nombre': 'Nombre',
    'material': 'Material',
    'alto': 'Alto (cm)',
    'largo': 'Largo (cm)',
    'ancho': 'Ancho (cm)',
    'pulgada': 'Pulgadas',
    'nombreJornada': 'Nombre Jornada',
    'nombreCargo': 'Nombre Cargo',
    'nombreEmpresa': 'Nombre Empresa',
    'id': 'ID',
  };

  // Campos que deben ser numéricos
  private camposNumericos = ['alto', 'largo', 'ancho', 'pulgada'];

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
      // Si es un campo numérico y es un nuevo elemento, inicializar en 0
      const isNumeric = this.camposNumericos.includes(campo);
      const defaultValue = isNumeric ? 0 : '';

      group[campo] = [
        this.data.elemento?.[campo] !== undefined && this.data.elemento?.[campo] !== null
          ? this.data.elemento[campo]
          : defaultValue,
        Validators.required
      ];
    });

    this.form = this.fb.group(group);
  }

  obtenerLabel(campo: string): string {
    return this.labelMap[campo] || campo;
  }

  esCampoNumerico(campo: string): boolean {
    return this.camposNumericos.includes(campo);
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
