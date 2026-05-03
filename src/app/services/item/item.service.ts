import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ItemModel } from '../../models/item.model';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor() { }

  private http = inject(HttpClient);
  // private apiUrl = 'https://localhost:7064/api/Item';
  private apiUrl = `${environment.apiUrl}/Item`;

  getItems(filtro: string) {
    // Aquí puedes construir la URL con el filtro si tu API lo soporta
    const params = new HttpParams().set('buscar', filtro);
    return this.http.get<ItemModel[]>(this.apiUrl, { params });
  }
}
