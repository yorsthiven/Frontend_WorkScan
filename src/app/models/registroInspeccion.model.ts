export interface RegistroInspeccion {
  estado: number; // "En Proceso", "Completada", etc.
  idTrabajador: number;
  idSintomatologiaNavigation: SintomatologiaCreateDto;
  items: ItemRegistroDto[];
  descripcionBiomecanica:DescripcionBiomecanicaCreateDto
}

export interface AuxDescBiomecanicaItemCreateDto {
  idItem: number;
  idDescripcionBiomecanica: number;
  idDescripcionBiomecanicaNavigation: DescripcionBiomecanicaCreateDto;
  idItemNavigation: ItemRegistroDto;
}

export interface DescripcionBiomecanicaCreateDto {
  funciones: string;
  postura: string;
  movimientos: string;
  cargas: string;
}

export interface ItemRegistroDto {
  idItem: number;
  nombre: string;
  material: string;
  alto: number;
  ancho: number;
  largo: number;
  pulgada: number;
  fotos: File[]; // ruta de la carpeta donde estan las fotos
  hallazgos: string[];
  recomendaciones: string[];
}

export interface SintomatologiaCreateDto {
  diagnostico: string;
  antecedentes: string;
  dolor: boolean;
  tipoDolor: number;
  calificacionEva: number;
}

// export interface ItemEvaluado {
//   idItem: number;
//   nombreItem?: string; // Para mostrar en el resumen
//   calificacionEva: number;
//   fotos: string[]; // Base64 o URLs temporales
//   hallazgos: number[]; // IDs de los hallazgos seleccionados
//   recomendaciones: number[]; // IDs de las recomendaciones seleccionadas
// }
