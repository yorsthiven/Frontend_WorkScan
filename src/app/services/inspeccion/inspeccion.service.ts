import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RespuestaGetInspecciones } from '../../models/Respuestas/responses.model';
import { Observable } from 'rxjs';
import { RegistroInspeccion } from '../../models/registroInspeccion.model';

@Injectable({
  providedIn: 'root',
})
export class InspeccionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7064/api/Inspeccion';

  getInspeccion(filtro: string): Observable<RespuestaGetInspecciones> {
    const params = new HttpParams().set('buscar', filtro);
    return this.http.get<RespuestaGetInspecciones>(this.apiUrl, { params });
  }

  guardarInspeccionCompleta(inspeccionCreateDto: RegistroInspeccion): Observable<any> {
    return this.http.post(this.apiUrl, inspeccionCreateDto);
  }
}
