import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajador } from '../../models/trabajador.model';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7064/api/Trabajador';

  /**
   *
   */
  // constructor() {}

  getTrabajadores(filtro:string): Observable<Trabajador[]> {
    const params = new HttpParams().set('buscar', filtro);

    return this.http.get<Trabajador[]>(this.apiUrl,{params});
  }

  // En trabajador.service.ts
  crearTrabajador(trabajador: any) {
    return this.http.post(`${this.apiUrl}/Trabajador`, trabajador);
  }
}
