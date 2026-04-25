import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistroInspeccion } from '../../../../../models/registroInspeccion.model';
import { MaterialModules } from '../../../../../shared/material.providers';
import { MatDialog } from '@angular/material/dialog';
import { DialogItemComponent } from '../dialog-item.component/dialog-item.component';
import { MatStepper } from '@angular/material/stepper';
import { TrabajadorService } from '../../../../../services/trabajador/trabajador.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Trabajador } from '../../../../../models/trabajador.model';
import { TablaMaestraComponent } from '../../../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../../../services/inspeccion/inspeccion.service';

@Component({
  selector: 'app-inspeccion-registro',
  imports: [MaterialModules, ReactiveFormsModule, TablaMaestraComponent],
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
  trabajadorService = inject(TrabajadorService);
  inspeccionService = inject(InspeccionService);
  filtroTrabajador = new FormControl('');
  trabajadorSeleccionado = signal<Trabajador | null>(null);
  ngOnInit() {
    this.cargarTrabajadores('');
    // 2. Lógica de búsqueda reactiva
    this.filtroTrabajador.valueChanges
      .pipe(
        debounceTime(300), // Espera 300ms después de que el usuario deja de escribir
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
  itemsEvaluados = signal<any[]>([]);

  finalizarInspeccion() {
    const inspeccionFinal: RegistroInspeccion = {
      estado: this.datosBasicosForm.value.estado!,
      idTrabajador: this.datosBasicosForm.value.idTrabajador!,
      idSintomatologiaNavigation: this.sintomatologiaForm.value as any,
      itemsEvaluados: this.itemsEvaluados(),
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const nuevoItemEvaluado = {
          idItem: result.idItem || result.itemInfo?.idItem, // Ajuste según lo que devuelva tu modal
          idDescripcionBiomecanica: result.idDescripcionBiomecanica || result.itemInfo?.idDescripcionBiomecanica,
          idDescripcionBiomecanicaNavigation: this.biomecanicaGeneralForm.value,

          // Mapeamos los datos para que la tabla los encuentre fácilmente
          idItemNavigation: result,

          // AGREGAMOS ESTAS LÍNEAS PARA LA TABLA:
          nombre: result.nombre || result.itemInfo?.nombre,
          material: result.material || result.itemInfo?.material,
          hallazgos: result.hallazgos || [],
          fotos: result.fotos || [],
        };

        this.itemsEvaluados.update((items) => [...items, nuevoItemEvaluado]);
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
    // const inspeccionFinal: RegistroInspeccion = {
    //   estado: this.datosBasicosForm.value.estado!,
    //   idTrabajador: this.datosBasicosForm.value.idTrabajador!,
    //   idSintomatologiaNavigation: this.sintomatologiaForm.value as any,
    //   itemsEvaluados: this.itemsEvaluados(),
    // };

    this.inspeccionService.guardarInspeccionCompleta(inspeccionFinal).subscribe({
      next: (resp) => {
        console.log('Inspección guardada correctamente');
        console.log("respuesta",resp);
        // Aquí puedes redirigir o mostrar un mensaje de éxito
      },
      error: (err) => {
        console.error('Error al guardar la inspección', err);
        // Aquí puedes mostrar un mensaje de error
      }
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
