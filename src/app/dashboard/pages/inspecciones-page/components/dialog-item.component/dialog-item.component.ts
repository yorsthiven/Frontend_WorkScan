import { ItemModel } from './../../../../../models/item.model';
import { ChangeDetectionStrategy, Component, Input, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModules } from '../../../../../shared/material.providers';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ItemService } from '../../../../../services/item/item.service';
import { InputBusquedaListaComponent } from '../input-busqueda-lista.component/input-busqueda-lista.component';
import { PhotoUploaderComponent } from '../photo-uploader.component/photo-uploader.component';
import { ItemRegistroDto } from '../../../../../models/registroInspeccion.model';

@Component({
  selector: 'app-dialog-item.component',
  imports: [
    MaterialModules,
    ReactiveFormsModule,
    InputBusquedaListaComponent,
    PhotoUploaderComponent,
  ],
  templateUrl: './dialog-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogItemComponent {
  private _fb = inject(FormBuilder);
  private _dialogRef = inject(MatDialogRef<DialogItemComponent>);
  private _itemsService = inject(ItemService);
  private _dialogData = inject(MAT_DIALOG_DATA, { optional: true }) as ItemRegistroDto | undefined;

  modoCreacion = signal<boolean>(false);
  modoEdicion = signal<boolean>(false); // Nueva señal para detectar edición
  listaItems = signal<ItemModel[]>([]); // Items que vienen de la API

  idItemSeleccionado = signal<number>(0);
  filtroItemControl = new FormControl(''); // Control para el input de búsqueda

  // Listas para la inspección
  hallazgos = signal<string[]>([]);
  recomendaciones = signal<string[]>([]);
  // fotos = signal<string[]>([]); // Array de strings (Base64)
  fotos = signal<File[]>([]);

  itemForm = this._fb.group({
    idItem: [0], // Quitamos el required de aquí, lo validaremos manualmente al guardar
    nombre: ['', Validators.required],
    material: [''],
    alto: [0],
    ancho: [0],
    largo: [0],
    pulgada: [0],
    hallazgoTemporal: [''],
    recomendacionTemporal: [''],
  });

  ngOnInit() {
    // 1. Si hay datos (modo edición), prellenamos el formulario
    if (this._dialogData) {
      this.modoEdicion.set(true);
      this.itemForm.patchValue({
        idItem: this._dialogData.idItem,
        nombre: this._dialogData.nombre,
        material: this._dialogData.material,
        alto: this._dialogData.alto,
        ancho: this._dialogData.ancho,
        largo: this._dialogData.largo,
        pulgada: this._dialogData.pulgada,
      });
      this.hallazgos.set(this._dialogData.hallazgos || []);
      this.recomendaciones.set(this._dialogData.recomendaciones || []);
      this.fotos.set(this._dialogData.fotos || []);

      // En modo edición, cargar el item en la lista para que se muestre seleccionado
      this.cargarItems('');
      // Después de cargar, preseleccionar el item
      setTimeout(() => {
        const itemEnEdicion = this.listaItems().find(item => item.id === this._dialogData!.idItem);
        if (itemEnEdicion) {
          this.itemForm.patchValue({ idItem: itemEnEdicion.id });
        }
      }, 200);
    }

    // 2. Carga inicial de ítems para que no aparezca vacío al abrir
    if (!this._dialogData) {
      this.cargarItems('');
    }

    // 3. Escucha reactiva del input de búsqueda
    this.filtroItemControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((valor) => {
          return this._itemsService.getItems(valor || '');
        }),
      )
      .subscribe({
        next: (data) => {
          this.listaItems.set(data);
        },
        error: (err) => console.error('Error filtrando ítems:', err),
      });
  }

  onSelectOpened(opened: boolean) {
    if (!opened) {
      this.filtroItemControl.setValue('');
    }
  }

  cargarItems(filtro: string) {
    this._itemsService.getItems(filtro).subscribe((data) => this.listaItems.set(data));
  }

  quitarFoto(index: number) {
    this.fotos.update((prev) => prev.filter((_, i) => i !== index));
  }

  // // --- RESTO DE LÓGICA ---
  // activarModoCreacion() {
  //   this.modoCreacion.set(true);
  //   this.itemForm.get('idItemMaestro')?.clearValidators();
  //   this.itemForm.get('nombreNuevo')?.setValidators(Validators.required);
  //   this.itemForm.updateValueAndValidity();
  // }

  agregarALista(tipo: 'H' | 'R') {
    const controlName = tipo === 'H' ? 'hallazgoTemporal' : 'recomendacionTemporal';
    const valor = this.itemForm.get(controlName)?.value;

    if (valor) {
      if (tipo === 'H') this.hallazgos.update((p) => [...p, valor]);
      else this.recomendaciones.update((p) => [...p, valor]);
      this.itemForm.get(controlName)?.reset();
    }
  }
  // MÉTODO PARA CERRAR EL MODAL Y ENVIAR LOS DATOS AL COMPONENTE PRINCIPAL
  confirmarItem() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const idSeleccionado = this.itemForm.get('idItem')?.value;

    // Extraemos los valores del formulario
    const formValues = this.itemForm.value;

    // Construimos el objeto final para el componente 'inspeccion-registro'
    const itemParaRegistrar = {
      idItem: idSeleccionado,
      nombre: formValues.nombre,
      material: formValues.material,
      alto: formValues.alto,
      ancho: formValues.ancho,
      largo: formValues.largo,
      pulgada: formValues.pulgada,

      // Enviamos las señales que contienen la data real (incluyendo los Files)
      hallazgos: this.hallazgos(),
      recomendaciones: this.recomendaciones(),
      fotos: this.fotos(), // <-- Estos son los archivos File[] para el backend
    };

    // Cerramos enviando la data
    this._dialogRef.close(itemParaRegistrar);
  }

  // Al seleccionar un ítem del desplegable
  // Vamos a cambiar el HTML a [value]="item" y el TS así:
  onItemSeleccionado(item: ItemModel) {
    // Solo poblamos los datos para lectura, no cambiamos a modo edición
    this.itemForm.patchValue({
      idItem: item.id,
      nombre: item.nombre,
      material: item.material,
      alto: item.alto,
      ancho: item.ancho,
      largo: item.largo,
      pulgada: item.pulgada,
    });
  }

  // ------MODAL DE CREACIÓN DE ÍTEM MAESTRO------
  // Esta es la función que luego usaremos para abrir el otro modal
  abrirFormularioMaestro() {
    console.log('Aquí llamaremos al modal de creación de ítems maestros');
    // Por ahora lo dejamos vacío como pediste
  }

  //------ SECCION DE HALLAZGOs------
  // Dentro de la clase DialogItemComponent

  agregarHallazgo() {
    const control = this.itemForm.get('hallazgoTemporal');
    const valor = control?.value?.trim();

    if (valor) {
      // Actualizamos la señal con el nuevo hallazgo
      this.hallazgos.update((prev) => [...prev, valor]);
      // Limpiamos el input para el siguiente
      control?.reset();
    }
  }

  eliminarHallazgo(index: number) {
    this.hallazgos.update((prev) => prev.filter((_, i) => i !== index));
  }

  //------ SECCION DE RECOMENDACIONES------
  // 2. Método para mover del input a la lista de recomendaciones
  agregarRecomendacion() {
    const input = this.itemForm.get('recomendacionTemporal');
    const valor = input?.value?.trim();

    if (valor) {
      this.recomendaciones.update((prev) => [...prev, valor]);
      input?.reset();
    }
  }

  eliminarRecomendacion(index: number) {
    this.recomendaciones.update((prev) => prev.filter((_, i) => i !== index));
  }

  cerrarModal() {
    this._dialogRef.close();
  }

  // ------ SECCION DE FOTOS------
}
