import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {  RespuestaGetInspecciones,  RespuestaPostInspeccion,} from '../../models/Respuestas/responses.model';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class InspeccionService {
  private http = inject(HttpClient);
  // private apiUrl = 'https://localhost:7064/api/Inspeccion';
  private apiUrl = `${environment.apiUrl}/Inspeccion`;

  getInspeccion(filtro: string): Observable<RespuestaGetInspecciones> {
    const params = new HttpParams().set('buscar', filtro);
    return this.http.get<RespuestaGetInspecciones>(this.apiUrl, { params });
  }


  // En inspeccion.service.ts
  crearInspeccion(formData: FormData): Observable<RespuestaPostInspeccion> {
    return this.http.post<RespuestaPostInspeccion>(`${this.apiUrl}`, formData);
  }

}
