import { MaterialModules } from './../../../shared/material.providers';
import { Component, inject, Inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModules } from '../../../shared/shared-forms';
import { InputGenericoComponent } from '../../shared/genericos/input-generico.component/input-generico.component';
import { TrabajadorService } from '../../../services/trabajador/trabajador.service';
import { SpinnerGenericoComponent } from '../../shared/genericos/spinner-generico.component/spinner-generico.component';
import { NotificacionService } from '../../../services/notificacion/notificacion.service';
import { capitalizarFrase } from '../../../shared/formatear';

@Component({
  selector: 'app-trabajador-form',
  imports: [MaterialModules, FormsModules, InputGenericoComponent, SpinnerGenericoComponent],
  templateUrl: './trabajador-form.html',
  styleUrl: './trabajador-form.css',
})
export class TrabajadorForm {
  private trabajadorService = inject(TrabajadorService);
  private notificacion = inject(NotificacionService);
  form: FormGroup;
  isLoading = signal(false);

  // Inyectamos los datos que vienen del padre
  private modalData = inject(MAT_DIALOG_DATA);

  // Mantenemos los signals para que la UI se actualice sola
  cargos = signal<any[]>([]);
  jornadas = signal<any[]>([]);
  roles = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrabajadorForm>,

    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // 2. Llena los datos aquí
    if (this.modalData) {
      this.cargos.set(this.modalData.cargos || []);
      this.jornadas.set(this.modalData.jornadas || []);
    }

    this.form = new FormGroup({
      cedula: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      // Datos Antropométricos
      estaturaCm: new FormControl(0, [
        Validators.required,
        Validators.min(50),
        Validators.max(999),
      ]),
      pesoKg: new FormControl(0, [Validators.required, Validators.min(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      // Fechas (puedes usar type="date" en el input)
      fechaIngresoEmpresa: new FormControl('', [Validators.required]),
      fechaIngresoCargo: new FormControl('', [Validators.required]),
      numeroContacto: new FormControl('', [Validators.required]),
      // IDs (Más adelante los cambiaremos por Selects, por ahora números)
      idRol: new FormControl(1, [Validators.required]),
      idJornada: new FormControl(null, [Validators.required]),
      idEmpresa: new FormControl(1, [Validators.required]),
      idCargo: new FormControl(null, [Validators.required]),
    });
  }

  // Función auxiliar para que el template no sufra con los tipos
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  guardar() {
    this.isLoading.set(true); // Encendemos el spinner
    if (this.form.valid) {
      // 1. Extraemos los valores del formulario
      const rawValues = this.form.value;

      // 2. Aplicamos la mayúscula inicial a Nombres y Apellidos
      const trabajadorDto = {
        ...rawValues,
        nombres: capitalizarFrase(rawValues.nombres),
        apellidos: capitalizarFrase(rawValues.apellidos),
      };

      // const trabajadorDto = this.form.value; // Ya tiene el formato de tu DTO de .NET

      // Llamamos al servicio aquí mismo
      this.trabajadorService.crearTrabajador(trabajadorDto).subscribe({
        next: (res) => {
          // Si el backend responde OK (ej: 201 Created)
          this.notificacion.show('success', 'Éxito', res.mensaje);
          this.isLoading.set(false);
          this.dialogRef.close(res); // Cerramos el modal y enviamos el nuevo trabajador de vuelta
        },
        error: (err) => {
          this.isLoading.set(false);
          const mensajeError = err.error?.mensaje || 'Error inesperado en el servidor';
          // Si hay error, el modal se queda abierto y puedes mostrar un mensaje
          // MENSAJE ROJO (Error)
          this.notificacion.show('error', 'Error en Registro', mensajeError);
          // alert('Hubo un error al guardar el trabajador. Revisa los datos.');
        },
      });
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  // A PARTIR DE AQUÍ SE MUESTRAN LOS DATOS DE CARGO Y JORNADAS.

  ngOnInit() {
    // this.cargarCatalogos();

    // Limitamos Estatura
    this.form.get('estaturaCm')?.valueChanges.subscribe((valor) => {
      if (valor && valor.toString().length > 3) {
        this.form
          .get('estaturaCm')
          ?.setValue(parseInt(valor.toString().slice(0, 3)), { emitEvent: false });
      }
    });

    // Limitamos Peso
    this.form.get('pesoKg')?.valueChanges.subscribe((valor) => {
      if (valor && valor.toString().length > 3) {
        this.form
          .get('pesoKg')
          ?.setValue(parseInt(valor.toString().slice(0, 3)), { emitEvent: false });
      }
    });
  }

  cargarCatalogos() {
    // 1. Cargar Cargos
    this.trabajadorService.getCargos().subscribe({
      next: (data) => this.cargos.set(data),
      error: () => this.cargos.set([{ id: 1, nombre: 'Error al cargar' }]),
    });

    // 2. Cargar Jornadas
    this.trabajadorService.getJornadas().subscribe({
      next: (data) => this.jornadas.set(data),
      error: () => this.jornadas.set([{ id: 1, nombre: 'Error al cargar' }]),
    });

    // 3. Cargar Roles
    this.trabajadorService.getRoles().subscribe({
      next: (data) => this.roles.set(data),
      error: () => this.roles.set([{ id: 1, nombre: 'Error al cargar' }]),
    });
  }
}
