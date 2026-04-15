import { Component, input, output } from '@angular/core';
import { ListaGenericaComponent } from "../lista-generica.component/lista-generica.component";

@Component({
  selector: 'app-search-generico',
  imports: [ListaGenericaComponent],
  templateUrl: './search-generico.component.html',
})
export class SearchGenericoComponent {
  placeholder = input<string>('Buscar...');
  onSearch = output<string>();

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.onSearch.emit(inputElement.value);
  }
}
