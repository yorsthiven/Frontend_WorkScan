import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaestroService {
  private http = inject(HttpClient);
  // private apiUrl = 'https://localhost:7064/api';
  private apiUrl = `${environment.apiUrl}`;

  // Método genérico para obtener datos
  getMaestro(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${endpoint}`);
  }

  // Método genérico para guardar (Crear/Editar)
  guardarMaestro(endpoint: string, data: any, isEdit: boolean): Observable<any> {
    if (isEdit) {
      return this.http.put(`${this.apiUrl}/${endpoint}/Actualizar/${data.id}`, data);
    }
    return this.http.post(`${this.apiUrl}/${endpoint}/Crear`, data);
  }

  // Método genérico para eliminar
  eliminarMaestro(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/Eliminar/${id}`);
  }
}
