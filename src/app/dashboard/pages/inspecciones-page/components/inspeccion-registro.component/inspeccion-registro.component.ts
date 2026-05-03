import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ItemRegistroDto,
  RegistroInspeccion,
} from '../../../../../models/registroInspeccion.model';
import { MaterialModules } from '../../../../../shared/material.providers';
import { MatDialog } from '@angular/material/dialog';
import { DialogItemComponent } from '../dialog-item.component/dialog-item.component';
import { MatStepper, MatStepLabel } from '@angular/material/stepper';
import { TrabajadorService } from '../../../../../services/trabajador/trabajador.service';
import { debounceTime, distinctUntilChanged, merge, switchMap } from 'rxjs';
import { Trabajador } from '../../../../../models/trabajador.model';
import { TablaMaestraComponent } from '../../../../../components/maestros/tabla-maestra.component/tabla-maestra.component';
import { InspeccionService } from '../../../../../services/inspeccion/inspeccion.service';
import { SpinnerGenericoComponent } from '../../../../../components/shared/genericos/spinner-generico.component/spinner-generico.component';
import { NotificacionService } from '../../../../../services/notificacion/notificacion.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inspeccion-registro',
  imports: [
    MaterialModules,
    ReactiveFormsModule,
    TablaMaestraComponent,
    SpinnerGenericoComponent,
    MatStepLabel,
  ],
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
  // En el padre (Configuración de Inspecciones)
  colsItems = signal([
    { key: 'nombre', label: 'Nombre' },
    { key: 'hallazgos', label: 'Hallazgos', cssClass: '!text-center font-bold' },
    { key: 'fotos', label: 'Fotos' },
    { key: 'recomendaciones', label: 'Recomendaciones', cssClass: 'font-bold' },
  ]);

  // Dentro de tu componente
  constructor(private router: Router) {
    // El effect detecta cambios en señales automáticamente
    effect(() => {
      // Agregamos un chequeo manual para que no falle al cargar la página
      if (this.itemsEvaluados().length > 0) {
        this.guardarProgresoLocal();
      }
    });
  }

  ngOnInit() {
    // 1. Carga inicial y lógica de búsqueda (Trabajadores)
    this.cargarTrabajadores('');
    this.filtroTrabajador.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((valor) => this.trabajadorService.getTrabajadores(valor || '')),
      )
      .subscribe((data) => {
        this.listaTrabajadores.set(data);
      });

    // 2. ACTIVAR EL AUTOGUARDADO
    // Lo ponemos ANTES de verificar el borrador para que empiece a escuchar
    merge(
      this.datosBasicosForm.valueChanges,
      this.sintomatologiaForm.valueChanges,
      this.biomecanicaGeneralForm.valueChanges,
    )
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe(() => {
        this.guardarProgresoLocal();
      });

    // 3. LA PREGUNTA MÁGICA (Solo una vez)
    this.verificarBorrador();
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

  finalizarInspeccion2() {
    const inspeccionFinal: RegistroInspeccion = {
      estado: this.datosBasicosForm.value.estado!,
      idTrabajador: this.datosBasicosForm.value.idTrabajador!,
      idSintomatologiaNavigation: this.sintomatologiaForm.value as any,
      items: this.itemsEvaluados(),
      descripcionBiomecanica: this.biomecanicaGeneralForm.value as any,
    };

    // console.log('Enviando a la API:', inspeccionFinal);
    // Aquí llamarías a tu servicio POST
    // this.guardarInspeccion(inspeccionFinal);
  }

  finalizarInspeccion() {
    this.isLoading.set(true);
    const formData = new FormData();

    // 1. Datos Básicos
    const basico = this.datosBasicosForm.value;
    formData.append('IdTrabajador', basico.idTrabajador!.toString());
    formData.append('Estado', basico.estado!.toString());

    // 2. Sintomatología (Mapeo manual según tu DTO de C#)
    const sintoma = this.sintomatologiaForm.value;
    formData.append('IdSintomatologiaNavigation.Diagnostico', sintoma.diagnostico || '');
    formData.append('IdSintomatologiaNavigation.Antecedentes', sintoma.antecedentes || '');
    formData.append('IdSintomatologiaNavigation.Dolor', sintoma.dolor?.toString() || 'false');
    formData.append('IdSintomatologiaNavigation.TipoDolor', sintoma.tipoDolor?.toString() || '0');
    formData.append(
      'IdSintomatologiaNavigation.CalificacionEva',
      sintoma.calificacionEva?.toString() || '0',
    );
    // ... repite con Hormigueo, Entumecimiento, etc.

    // 3. Descripción Biomecánica General
    const biomec = this.biomecanicaGeneralForm.value;
    formData.append('DescripcionBiomecanica.Funciones', biomec.funciones || '');
    formData.append('DescripcionBiomecanica.Postura', biomec.postura || '');
    formData.append('DescripcionBiomecanica.Movimientos', biomec.movimientos || '');
    formData.append('DescripcionBiomecanica.Cargas', biomec.cargas || '');

    // 4. ÍTEMS EVALUADOS (Aquí está la magia)
    // this.itemsEvaluados().forEach((item, index) => {
    this.itemsEvaluados().forEach((item: ItemRegistroDto, index: number) => {
      formData.append(`Items[${index}].IdItem`, item.idItem.toString());
      formData.append(`Items[${index}].Nombre`, item.nombre.toString());
      formData.append(`Items[${index}].Material`, item.material || '');
      formData.append(`Items[${index}].Alto`, item.alto?.toString() || '0');
      formData.append(`Items[${index}].Ancho`, item.ancho?.toString() || '0');
      formData.append(`Items[${index}].Largo`, item.largo?.toString() || '0');

      // Hallazgos y Recomendaciones (Listas de strings)
      item.hallazgos.forEach((h, hIdx) => {
        formData.append(`Items[${index}].Hallazgos[${hIdx}]`, h);
      });
      item.recomendaciones.forEach((r, rIdx) => {
        formData.append(`Items[${index}].Recomendaciones[${rIdx}]`, r);
      });

      // console.log(item);
      // FOTOS (Los archivos File[] que vienen del modal)
      // FOTOS
      // console.log('FormData:', formData);

      // if (item.fotos && item.fotos.length > 0) {
      //   item.fotos.forEach((fotoFile: File) => {
      //     formData.append(`Items[${index}].Fotos`, fotoFile, fotoFile.name);
      //   });
      // }
      // FOTOS (Solo si existen y son archivos válidos)
      if (item.fotos && item.fotos.length > 0) {
        item.fotos.forEach((fotoFile: any) => {
          if (fotoFile instanceof File || fotoFile instanceof Blob) {
            // Intentamos sacar el nombre, si no existe (es un Blob), inventamos uno
            const nombreArchivo = (fotoFile as File).name || `foto_${index}.jpg`;

            formData.append(`Items[${index}].Fotos`, fotoFile, nombreArchivo);
          }
        });
      }
    });

    // console.log('linea antes de ir al service:', formData);
    // 5. Envío al Service
    this.inspeccionService.crearInspeccion(formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        //  1. ELIMINAR EL BORRADOR (Súper importante para que no aparezca en la siguiente)
        localStorage.removeItem('workscan_borrador');
        Swal.fire('¡Guardado!', 'La inspección se registró con éxito', 'success');
        this.router.navigate(['/dashboard/inspecciones']);
      },
      error: (err) => {
        this.isLoading.set(false);
        // console.error('erroorrr', err);
        Swal.fire({
          title: 'Error',
          text: `${err.error?.mensaje || ''}`,
          icon: 'error',
        });
      },
    });
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
        // console.log(itemSeguro);
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

  private aplicarBorrador(borrador: any) {
    if (!borrador) return;

    // 1. Rellenamos los 3 formularios con seguridad
    if (borrador.base) this.datosBasicosForm.patchValue(borrador.base);
    if (borrador.sintomatologia) this.sintomatologiaForm.patchValue(borrador.sintomatologia);
    if (borrador.descripcionBiomecanica)
      this.biomecanicaGeneralForm.patchValue(borrador.descripcionBiomecanica);

    // 2. Seteamos la señal de ítems
    this.itemsEvaluados.set(borrador.items || []);

    // 3. Movemos el stepper al paso guardado
    if (borrador.pasoActual !== undefined) {
      setTimeout(() => {
        if (this.stepper) {
          this.stepper.selectedIndex = borrador.pasoActual;
        }
      }, 200); // Pequeño delay para que el DOM del stepper esté listo
    }
  }

  private guardarProgresoLocal() {
    if (!this.stepper) return;
    // El ? evita que el código "explote" si el stepper aún no existe
    const pasoActual = this.stepper?.selectedIndex || 0;

    const borrador = {
      base: this.datosBasicosForm.value,
      sintomatologia: this.sintomatologiaForm.value,
      descripcionBiomecanica: this.biomecanicaGeneralForm.value,
      items: this.itemsEvaluados(),
      pasoActual: pasoActual,
    };
    localStorage.setItem('workscan_borrador', JSON.stringify(borrador));
  }

  private verificarBorrador() {
    const borradorGuardado = localStorage.getItem('workscan_borrador');
    if (!borradorGuardado) return;

    Swal.fire({
      title: '¿Deseas retomar la inspección?',
      text: 'Parece que dejaste una inspección a medias. ¿Quieres continuar donde quedaste?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'No, empezar de cero',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.aplicarBorrador(JSON.parse(borradorGuardado));
      } else {
        localStorage.removeItem('workscan_borrador');
        // Opcional: resetear formularios si es necesario
      }
    });
  }
}
