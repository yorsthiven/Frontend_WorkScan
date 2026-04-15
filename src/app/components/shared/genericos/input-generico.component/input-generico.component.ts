import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-generico.component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-generico.component.html',
})
export class InputGenericoComponent {
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<string>('text'); // Aquí puedes pasar 'password', 'number', etc.
  control = input.required<FormControl>(); // El control de validación de Angular

  // Para mostrar errores amigables
  get errorMessage(): string {
    const errors = this.control().errors;
    if (!errors || !this.control().touched) return '';

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['email']) return 'Formato de correo inválido';
    return 'Campo inválido';
  }
}
