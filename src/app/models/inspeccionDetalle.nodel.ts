export interface InspeccionDetalle {
  idInspeccion: number;
  FechaInspeccion: Date;
  Estado: number;
  NombreTrabajador: string;
  CargoTrabajador: string;
  NombreUsuario: string;
  RolUsuario: string;

  //sintomatologia
  IdSintomatologia: number;
  CalificacionEva: number;
  Dolor: boolean;
  TipoDolor: number;
  DiagnosticoPrincipal: string;
  Antecedentes: string;
  Funciones: string;
  Postura: string;
  Movimientos: string;
  Cargas: string;
  ListaItems: Array<ItemResumenResumenDto>;
}
// --------------

export interface ItemResumenResumenDto {
  IdItem: number;
  Nombre: string;
  Material: string;
  ListaHallazgos: HallazgosResumenDetalleDto[];
  ListaRecomendaciones: RecomendacionesResumenDetalleDto[];
  ListaFotos: FotosResumenDetalleDto[];

  //Descripcion biomecanica
  InfoDescBiomecanica: DescripcionBiomecanicaDto;
}

export interface DescripcionBiomecanicaDto {
  id: number;
  funciones: string;
  posturas: string;
  movimientos: string;
  cargas: string;
}

export interface HallazgosResumenDetalleDto {
  IdHallazgo: number;
  DescHallazgos: string;
  Alto: number;
  Ancho: number;
  Largo: number;
  Pulgada: number;
}

export interface RecomendacionesResumenDetalleDto {
  IdRecomendacion: number;
  DescripcionRecomendaciones: string;
}

export interface FotosResumenDetalleDto {
  IdFoto: number;
  RutaFoto: string;
}
