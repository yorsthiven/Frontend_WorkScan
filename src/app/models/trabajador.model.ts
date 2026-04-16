export interface Trabajador {
  cedula: string;
  nombres: string;
  apellidos: string;
  estaturaCm: number;
  pesoKg: number;
  email: string;
  imcValor: number;
  imcDescripcion: string;
  idCargo: string;
  idJornada: string;
  numeroContacto:string;
  fechaIngresoEmpresa:Date;
  fechaIngresoCargo:Date;
  numeroCargo:number;
  numeroJornada:number;
}
