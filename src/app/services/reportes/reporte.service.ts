import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/Reporte`;

  generarReporte(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }
}
