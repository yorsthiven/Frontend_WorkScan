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
})
export class TrabajadorForm {
  private trabajadorService = inject(TrabajadorService);
  private notificacion = inject(NotificacionService);
  form: FormGroup;
  isLoading = signal(false);
  isEdit = signal(false);

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
      id: new FormControl(0),
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
      idJornada: new FormControl(1),
      idEmpresa: new FormControl(1, [Validators.required]),
      idCargo: new FormControl(1),
      numeroCargo: new FormControl(null, [Validators.required]),
      numeroJornada: new FormControl(null, [Validators.required]),
    });
  }

  // Función auxiliar para que el template no sufra con los tipos
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  guardar() {
    if (this.form.valid) {
      this.isLoading.set(true); // Encendemos el spinner

      // IMPORTANTE: usamos getRawValue() para que incluya la 'cedula' aunque esté deshabilitada
      const datosBase = this.form.getRawValue();

      // 1. Extraemos los valores del formulario
      // const rawValues = this.form.value;

      // 2. Aplicamos la mayúscula inicial a Nombres y Apellidos
      const trabajadorDto = {
        ...datosBase,
        nombres: capitalizarFrase(datosBase.nombres),
        apellidos: capitalizarFrase(datosBase.apellidos),
      };

      // Elegimos el servicio según el modo
      const operacion = this.isEdit()
        ? this.trabajadorService.actualizarTrabajador(trabajadorDto.id, trabajadorDto) // actualizarTrabajador iria aqui cuando se cree en el service
        : this.trabajadorService.crearTrabajador(trabajadorDto);

      operacion.subscribe({
        next: (res: any) => {
          // NORMALIZACIÓN: Buscamos el mensaje donde sea que esté
          const mensajeExito = res.mensaje || res.result?.mensaje || 'Operación exitosa';

          this.notificacion.show('success', 'Completado', mensajeExito);
          this.isLoading.set(false);
          this.dialogRef.close(true); // Cerramos indicando éxito
        },
        error: (err) => {
          this.isLoading.set(false);
          this.notificacion.show('error', 'Error', err.error?.mensaje || 'Error al procesar');
        },
      });

    }
  }

  cerrar() {
    this.dialogRef.close();
  }

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

    // Si en modalData viene un objeto 'trabajador', es porque vamos a editar
    if (this.modalData?.trabajador) {
      this.isEdit.set(true);

      setTimeout(() => {
        // 1. Extraemos los datos
        const t = this.modalData.trabajador;
        // 2. Buscamos el ID en nuestras señales de catálogos
        const cargoEncontrado = this.cargos().find((c) => c.nombre === t.idCargo);
        const jornadaEncontrada = this.jornadas().find((j) => j.nombre === t.idJornada);

        // const cargoEncontrado = this.cargos().find((c) => c.nombre === t.nombreCargo);

        if (cargoEncontrado) {
          // Asignamos el ID directamente al control
          this.form.get('idCargo')?.setValue(cargoEncontrado.id);
          // Forzamos la validación
          this.form.get('idCargo')?.updateValueAndValidity();
        }
        if (jornadaEncontrada) {
          // Asignamos el ID directamente al control
          this.form.get('idJornada')?.setValue(jornadaEncontrada.id);
          // Forzamos la validación
          this.form.get('idJornada')?.updateValueAndValidity();
        }
        // 3. Parchamos el formulario con los IDs encontrados
        this.form.patchValue({
          ...t,
          idCargo: cargoEncontrado?.id,
          idJornada: jornadaEncontrada?.id,
        });
      }, 100);

      // 1. Llenamos el formulario con los datos existentes
      // this.form.patchValue(this.modalData.trabajador);

      // 2. Bloqueamos la cédula (llave primaria no se debería editar)
      this.form.get('cedula')?.disable();
    }
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
