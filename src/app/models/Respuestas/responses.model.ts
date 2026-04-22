import { InspeccionDetalle } from "../inspeccionDetalle.nodel";

export interface RespuestaGetInspecciones {
  inspecciones: InspeccionDetalle[];
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
