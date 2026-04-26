import { ItemModel } from './../../../../../models/item.model';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModules } from '../../../../../shared/material.providers';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ItemService } from '../../../../../services/item/item.service';
import { InputBusquedaListaComponent } from '../input-busqueda-lista.component/input-busqueda-lista.component';
import { PhotoUploaderComponent } from '../photo-uploader.component/photo-uploader.component';

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

  modoCreacion = signal<boolean>(false);
  // listaItemsMaestros = signal<any[]>([]);
  // filtroBusqueda = new FormControl('');
  // Dentro de la clase DialogItemComponent
  listaItems = signal<ItemModel[]>([]); // Items que vienen de la API
  filtroItemControl = new FormControl(''); // Control para el input de búsqueda

  // Listas para la inspección
  hallazgos = signal<string[]>([]);
  recomendaciones = signal<string[]>([]);
  fotos = signal<string[]>([]); // Array de strings (Base64)

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
    // 1. Carga inicial de ítems para que no aparezca vacío al abrir
    this.cargarItems('');

    // 2. Escucha reactiva del input de búsqueda
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

  // --- LÓGICA DE FOTOS (Faltaba en tu código) ---
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Guardamos la imagen en formato Base64 para previsualizarla y enviarla
          this.fotos.update((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
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

  // --- RESTO DE LÓGICA ---
  activarModoCreacion() {
    this.modoCreacion.set(true);
    this.itemForm.get('idItemMaestro')?.clearValidators();
    this.itemForm.get('nombreNuevo')?.setValidators(Validators.required);
    this.itemForm.updateValueAndValidity();
  }

  agregarALista(tipo: 'H' | 'R') {
    const controlName = tipo === 'H' ? 'hallazgoTemporal' : 'recomendacionTemporal';
    const valor = this.itemForm.get(controlName)?.value;

    if (valor) {
      if (tipo === 'H') this.hallazgos.update((p) => [...p, valor]);
      else this.recomendaciones.update((p) => [...p, valor]);
      this.itemForm.get(controlName)?.reset();
    }
  }

  guardar() {
    const idSeleccionado = this.itemForm.get('idItem')?.value;

    if (idSeleccionado || this.modoCreacion()) {
      // Creamos el objeto asegurando que las listas nunca sean undefined
      const resultado = {
        // Usamos getRawValue para obtener todos los campos del form incluyendo los readonly
        ...this.itemForm.getRawValue(),
        hallazgos: this.hallazgos() || [],
        recomendaciones: this.recomendaciones() || [],
        fotos: this.fotos() || [],
        esNuevo: this.modoCreacion(),
      };

      // Eliminamos basura del objeto final
      delete (resultado as any).hallazgoTemporal;
      delete (resultado as any).recomendacionTemporal;
      this._dialogRef.close(resultado);
    }
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

  // ------ SECCION DE FOTOS------
}
