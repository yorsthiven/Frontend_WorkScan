import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RespuestaGetInspecciones } from '../../models/Respuestas/responses.model';

@Injectable({
  providedIn: 'root',
})
export class InspeccionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7064/api/Inspeccion';

  getInspeccion(){
    return this.http.get<RespuestaGetInspecciones>(this.apiUrl);
  }

  constructor() {}
}
