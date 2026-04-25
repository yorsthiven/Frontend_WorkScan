import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { MaterialModules } from '../../../../../shared/material.providers';

@Component({
  selector: 'app-photo-uploader',
  imports: [MaterialModules],
  templateUrl: './photo-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploaderComponent {
  // Emitimos el array de Base64 al padre
  onChanged = output<string[]>();

  fotos = signal<string[]>([]);

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.fotos.update((prev) => [...prev, base64]);
        this.onChanged.emit(this.fotos());
      };
      reader.readAsDataURL(file);
    });

    // Limpiar el input para permitir subir la misma foto si se borró
    event.target.value = '';
  }

  eliminarFoto(index: number) {
    this.fotos.update((prev) => prev.filter((_, i) => i !== index));
    this.onChanged.emit(this.fotos());
  }
}
