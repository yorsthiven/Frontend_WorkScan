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

  getTrabajadores(filtro: string): Observable<Trabajador[]> {
    const params = new HttpParams().set('buscar', filtro);

    return this.http.get<Trabajador[]>(this.apiUrl, { params });
  }

  // En trabajador.service.ts
  crearTrabajador(trabajador: Trabajador): Observable<RespuestaApi> {
    return this.http.post<RespuestaApi>(`${this.apiUrl}`, trabajador);
  }

  actualizarTrabajador(id: number, trabajador: Trabajador) {
    return this.http.put(`${this.apiUrl}/${id}`, trabajador);
  }

  getCargos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cargos`);
  }

  getJornadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/jornadas`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }
}
