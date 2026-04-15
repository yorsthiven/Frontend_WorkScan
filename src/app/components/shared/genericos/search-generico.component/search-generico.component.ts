import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-generico',
  imports: [],
  templateUrl: './search-generico.component.html',
})
export class SearchGenericoComponent {
  placeholder = input<string>('Buscar...');
  onSearch = output<string>();
  value = signal<string>(''); // Controlamos el valor con un signal

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value.set(inputElement.value);
    this.onSearch.emit(this.value());
  }

  clearInput() {
    this.value.set(''); // Limpiamos el signal
    this.onSearch.emit(''); // Avisamos que la búsqueda está vacía para refrescar la lista
  }
}
