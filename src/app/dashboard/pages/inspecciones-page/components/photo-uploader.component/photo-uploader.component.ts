import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MaterialModules } from '../../../../../shared/material.providers';

@Component({
  selector: 'app-photo-uploader',
  imports: [MaterialModules],
  templateUrl: './photo-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploaderComponent {
  onChanged = output<File[]>();
  fotosBase64 = signal<string[]>([]);
  archivosReales = signal<File[]>([]);
  fotosIniciales = input<File[]>([]);

  private fotosInicalesYaCargadas = signal(false);

  ngOnInit() {
    // ESTO SOLO SE EJECUTA UNA VEZ AL INICIAR EL COMPONENTE
    const fotos = this.fotosIniciales();
    if (fotos && fotos.length > 0) {
      this.archivosReales.set([...fotos]);

      fotos.forEach((file) => {
        if (file instanceof File) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.fotosBase64.update((prev) => [...prev, e.target.result]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    const nuevosArchivos = Array.from(files).filter((f) => f.type.startsWith('image/'));

    nuevosArchivos.forEach((file) => {
      // 1. Guardamos el binario para el backend
      this.archivosReales.update((prev) => [...prev, file]);

      // 2. Generamos el base64 para la vista
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotosBase64.update((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // 3. Emitimos los BINARIOS al padre (Dialog)
    this.onChanged.emit(this.archivosReales());
    event.target.value = '';
  }

  eliminarFoto(index: number) {
    this.fotosBase64.update((prev) => prev.filter((_, i) => i !== index));
    this.archivosReales.update((prev) => prev.filter((_, i) => i !== index));
    this.onChanged.emit(this.archivosReales());
  }
}
