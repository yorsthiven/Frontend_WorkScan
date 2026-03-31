import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trabajador } from '../../models/trabajador.model';

@Injectable({
  providedIn: 'root',
})
export class TrabajadorService {
  private apiUrl = 'https://localhost:7064/api/Trabajador';

  /**
   *
   */
  constructor(private http: HttpClient) {}

  getTrabajadores(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.apiUrl);
  }

  // En trabajador.service.ts
  crearTrabajador(trabajador: any) {
    return this.http.post(`${this.apiUrl}/Trabajador`, trabajador);
  }
}
