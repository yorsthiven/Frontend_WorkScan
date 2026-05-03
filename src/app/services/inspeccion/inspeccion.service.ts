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

  // guardarInspeccionCompleta(inspeccionCreateDto: RegistroInspeccion,): Observable<RespuestaPostInspeccion> {
  //   console.log('llega al service', inspeccionCreateDto);
  //   // return this.http.post<RespuestaPostInspeccion>(this.apiUrl, inspeccionCreateDto);
  //   return this.http.post<RespuestaPostInspeccion>(`${this.apiUrl}`, inspeccionCreateDto);
  // }

  // En inspeccion.service.ts
  crearInspeccion(formData: FormData): Observable<RespuestaPostInspeccion> {
    // console.log('llega al service', formData);
    // console.log('APIURL -->', this.apiUrl);
    // NO agregues 'Content-Type': 'application/json' aquí
    // porque el navegador debe poner 'multipart/form-data' automáticamente
    return this.http.post<RespuestaPostInspeccion>(`${this.apiUrl}`, formData);
  }

  // crearInspeccion(datos: any): Observable<any> {
  //   console.log('llega al service', datos);
  //   const formData = new FormData();

  //   // 1. Campos simples de la raíz
  //   formData.append('IdTrabajador', datos.idTrabajador.toString());
  //   formData.append('Estado', datos.estado.toString());

  //   // 2. Objetos anidados (Sintomatología)
  //   formData.append('IdSintomatologiaNavigation.Diagnostico', datos.sintomatologia.diagnostico);
  //   formData.append('IdSintomatologiaNavigation.Dolor', datos.sintomatologia.dolor);
  //   // ... agrega los demás campos de sintomatología

  //   // 3. Descripción Biomecánica
  //   formData.append('DescripcionBiomecanica.Funciones', datos.biomecanica.funciones);
  //   // ... agrega los demás

  //   // 4. Los Ítems (La parte clave para los archivos)
  //   datos.items.forEach((item: any, index: number) => {
  //     formData.append(`Items[${index}].IdItem`, item.idItem.toString());

  //     // Hallazgos
  //     item.hallazgos.forEach((h: string, i: number) => {
  //       formData.append(`Items[${index}].Hallazgos[${i}]`, h);
  //     });

  //     // FOTOS (Aquí pasas los archivos File de HTML5)
  //     if (item.fotos && item.fotos.length > 0) {
  //       item.fotos.forEach((archivo: File) => {
  //         // IMPORTANTE: La key debe ser EXACTAMENTE 'Items[index].Fotos'
  //         formData.append(`Items[${index}].Fotos`, archivo, archivo.name);
  //       });
  //     }
  //   });

  //   return this.http.post(`${this.apiUrl}/Inspeccion`, formData);
  // }
}
