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

@Component({
  selector: 'app-inspeccion-registro',
  imports: [MaterialModules, ReactiveFormsModule],
  templateUrl: './inspeccion-registro.component.html',
})
export class InspeccionRegistroComponent {
  private _fb = inject(FormBuilder);
  private _dialog = inject(MatDialog);
  trabajadores = signal<{ id: number; cedula: string; nombres: string; apellidos: string ; email:string; numeroContacto:string}[]>([]);
  trabajadorService = inject(TrabajadorService);
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
      .subscribe((data) => this.trabajadores.set(data));
  }

  datosBasicosForm = this._fb.group({
    idTrabajador: [null as number | null, Validators.required],
    estado: 1, // "En Proceso" por defecto
  });

  // Paso 2: Sintomatología
  sintomatologiaForm = this._fb.group({
    diagnostico: ['', Validators.required],
    antecedentes: [''],
    dolor: [true],
    tipoDolor: [0],
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
  }

  abrirModalAgregarItem() {
    const dialogRef = this._dialog.open(DialogItemComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Mapeamos el resultado al formato AuxDescBiomecanicaItemCreateDto
        const nuevoItemEvaluado = {
          idItem: result.idItem,
          idDescripcionBiomecanica: '', // Se genera en el backend o se vincula luego
          idDescripcionBiomecanicaNavigation: this.biomecanicaGeneralForm.value, // Tomamos la biomecánica del paso 3
          idItemNavigation: result,
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
    // Aquí puedes meter lógica extra
    // console.log('Procesando datos antes de seguir...');

    // Ordenamos al stepper avanzar
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
        this.trabajadores.set(lista);
      },
      error: (err) => console.error('Error cargando trabajadores', err),
    });
  }

  buscarTrabajadores(query: string) {
    this.trabajadorService.getTrabajadores(query).subscribe((data) => {
      this.trabajadores.set(data);
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
    const seleccionado = this.trabajadores().find((t) => t.id === id);
    if (seleccionado) {
      this.trabajadorSeleccionado.set(seleccionado);
    }
  }
}
