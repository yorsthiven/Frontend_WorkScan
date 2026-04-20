export interface RespuestaGetInspecciones {
  inspecciones: Inspecciones[];
  mensaje: string;
}

export interface Inspecciones {
  calificacionEva: number;
  diagnosticoPrincipal: string;
  documentoTrabajador: string;
  fecha: string;
  idInspeccion: number;
  nombreTrabajador: string;
}
