import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ItemRegistroDto,
  RegistroInspeccion,
} from '../../../../../models/registroInspeccion.model';
import { MaterialModules } from '../../../../../shared/material.providers';
import { MatDialog } from '@angular/material/dialog';
import { DialogItemComponent } from '../dialog-item.component/dialog-item.component';
import { MatStepper } from '@angular/material/stepper';
import { TrabajadorService } from '../../../../../services/trabajador/trabajador.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Trabajador } from '../../../../../models/trabajador.model';
import { TablaMaestraComponent } from '../../../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../../../services/inspeccion/inspeccion.service';
import { SpinnerGenericoComponent } from '../../../../../components/shared/genericos/spinner-generico.component/spinner-generico.component';
import { NotificacionService } from '../../../../../services/notificacion/notificacion.service';

@Component({
  selector: 'app-inspeccion-registro',
  imports: [MaterialModules, ReactiveFormsModule, TablaMaestraComponent, SpinnerGenericoComponent],
  templateUrl: './inspeccion-registro.component.html',
})
export class InspeccionRegistroComponent {
  private _fb = inject(FormBuilder);
  private _dialog = inject(MatDialog);
  listaTrabajadores = signal<
    {
      id: number;
      cedula: string;
      nombres: string;
      apellidos: string;
      email: string;
      numeroContacto: string;
    }[]
  >([]);

  isLoading = signal(false);
  private notificacion = inject(NotificacionService);
  trabajadorService = inject(TrabajadorService);
  inspeccionService = inject(InspeccionService);
  filtroTrabajador = new FormControl('');
  trabajadorSeleccionado = signal<Trabajador | null>(null);

  ngOnInit() {
    this.cargarTrabajadores('');
    // 2. Lógica de búsqueda reactiva
    this.filtroTrabajador.valueChanges
      .pipe(
        debounceTime(200), // Espera 200ms después de que el usuario deja de escribir
        distinctUntilChanged(), // Solo busca si el texto cambió
        switchMap((valor) => this.trabajadorService.getTrabajadores(valor || '')),
      )
      .subscribe((data) => {
        this.listaTrabajadores.set(data);
      });
  }

  // tiposDolores = signal<{ id: number; nombre: string;}[]>([]);
  //prueba de tipos de dolores
  tiposDolores = signal([
    { id: 1, nombre: 'Sin dolor' },
    { id: 2, nombre: 'Agudo' },
    { id: 3, nombre: 'Crónico' },
    { id: 4, nombre: 'Nociceptivo' },
    { id: 5, nombre: 'Neuropático' },
    { id: 6, nombre: 'Inflamatorio' },
    { id: 7, nombre: 'Mecánico' },
    { id: 8, nombre: 'Referido' },
    { id: 9, nombre: 'Punzante' },
    { id: 10, nombre: 'Opresivo' },
    { id: 11, nombre: 'Constante' },
  ]);

  datosBasicosForm = this._fb.group({
    idTrabajador: [null as number | null, Validators.required],
    estado: 1, // "En Proceso" por defecto
  });

  // Paso 2: Sintomatología
  sintomatologiaForm = this._fb.group({
    diagnostico: ['', Validators.required],
    antecedentes: ['', Validators.required],
    dolor: [true, Validators.required],
    tipoDolor: [{ value: 0, disabled: false }, Validators.required],
    calificacionEva: [0, [Validators.min(0), Validators.max(10)]],
  });

  // Paso 3: Biomecánica General (Esta se aplicará a los items)
  biomecanicaGeneralForm = this._fb.group({
    funciones: ['', Validators.required],
    postura: ['', Validators.required],
    movimientos: ['', Validators.required],
    cargas: ['', Validators.required],
  });

  // Lista de items evaluados que se irá llenando
  itemsEvaluados = signal<ItemRegistroDto[]>([]);

  finalizarInspeccion() {
    const inspeccionFinal: RegistroInspeccion = {
      estado: this.datosBasicosForm.value.estado!,
      idTrabajador: this.datosBasicosForm.value.idTrabajador!,
      idSintomatologiaNavigation: this.sintomatologiaForm.value as any,
      items: this.itemsEvaluados(),
      descripcionBiomecanica: this.biomecanicaGeneralForm.value as any,
    };

    console.log('Enviando a la API:', inspeccionFinal);
    // Aquí llamarías a tu servicio POST
    this.guardarInspeccion(inspeccionFinal);
  }

  abrirModalAgregarItem() {
    const dialogRef = this._dialog.open(DialogItemComponent, {
      width: '800px',
      disableClose: false,
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: ItemRegistroDto) => {
      if (result) {
        // Forzamos que las listas sean arreglos aunque vengan vacías
        const itemSeguro: ItemRegistroDto = {
          ...result,
          hallazgos: result.hallazgos || [],
          fotos: result.fotos || [],
          recomendaciones: result.recomendaciones || [],
        };

        this.itemsEvaluados.update((items) => [...items, itemSeguro]);
      }
    });
  }

  // Helper para el color del slider EVA
  getEvaLabelColor() {
    const eva = this.sintomatologiaForm.get('calificacionEva')?.value || 0;
    if (eva <= 3) return 'text-green-500';
    if (eva <= 7) return 'text-orange-500';
    return 'text-red-500';
  }

  // Obtenemos la referencia del stepper que pusiste en el HTML como #stepper
  @ViewChild('stepper') stepper!: MatStepper;

  irAlSiguientePaso() {
    this.stepper.next();
  }

  irAlPasoAtras() {
    this.stepper.previous();
  }

  // -------TRABAJADORES-------
  // Método para cargar trabajadores inicialmente o con filtro desde el servicio y actualizar la señal correspondiente
  cargarTrabajadores(termino: string) {
    this.trabajadorService.getTrabajadores(termino).subscribe({
      next: (data) => {
        // Mapeamos para tener solo lo necesario en el select
        const lista = data.map((t) => ({
          id: t.id,
          cedula: t.cedula,
          nombres: `${t.nombres}`,
          apellidos: `${t.apellidos}`,
          email: `${t.email}`,
          numeroContacto: `${t.numeroContacto}`,
        }));
        this.listaTrabajadores.set(lista);
      },
      error: (err) => console.error('Error cargando trabajadores', err),
    });
  }

  // Limpia la búsqueda cuando se cierra el select
  onSelectOpened(opened: boolean) {
    if (!opened) {
      this.filtroTrabajador.setValue('');
    }
  }
  // Función para capturar el cambio
  onTrabajadorChange(id: number) {
    const seleccionado = this.listaTrabajadores().find((t) => t.id === id);
    if (seleccionado) {
      this.trabajadorSeleccionado.set(seleccionado);
    }
  }

  // -----TIPO DE DOLOR-----
  onTipoDolorChange(tipo: number) {
    // Aquí puedes manejar la lógica según el tipo de dolor seleccionado
  }

  onDolorChange(checked: boolean) {
    if (!checked) {
      this.sintomatologiaForm.get('calificacionEva')?.setValue(0);
      this.sintomatologiaForm.get('tipoDolor')?.setValue(1);
      this.sintomatologiaForm.get('tipoDolor')?.disable();
    } else {
      this.sintomatologiaForm.get('tipoDolor')?.enable();
    }
  }

  // ------ITEM EVALUADOS------

  // Definimos las columnas que verá el usuario en la tabla de este paso
  columnasItems = ['nombre', 'material', 'hallazgos', 'acciones'];

  eliminarItem(itemAEliminar: any) {
    // Filtramos para quitar el ítem de la lista
    this.itemsEvaluados.update((prev) => prev.filter((i) => i !== itemAEliminar));
  }

  guardarInspeccion(inspeccionFinal: RegistroInspeccion) {
    this.isLoading.set(true);
    console.log('inicio de guardar inspeccion: ----> ', inspeccionFinal);
    this.inspeccionService.guardarInspeccionCompleta(inspeccionFinal).subscribe({
      next: (resp) => {
        console.log('Inspección guardada correctamente');
        console.log('respuesta', resp);
        const mensajeExito = resp.mensaje || 'Operación exitosa';
        this.notificacion.show('success', 'Completado', mensajeExito);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al guardar la inspección', err);
        // Aquí puedes mostrar un mensaje de error
        this.isLoading.set(false);
        this.notificacion.show('error', 'Error', err.error?.mensaje || 'Error al procesar');
      },
    });
  }

  // En el padre (Configuración de Inspecciones)
  colsItems = signal([
    { key: 'nombre', label: 'Nombre' },
    { key: 'hallazgos', label: 'Hallazgos', cssClass: '!text-center font-bold' },
    { key: 'fotos', label: 'Fotos' },
    { key: 'recomendaciones', label: 'Recomendaciones', cssClass: 'font-bold' },
  ]);
}
