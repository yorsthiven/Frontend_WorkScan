export interface Trabajador {
  idTrabajador?: number; // El ? es porque al crear uno nuevo, no tiene ID aún
  numeroDocumento: string;
  nombreCompleto: string;
  cargo: string;
  area: string;
  // Añade aquí los campos exactos que tengas en tu DTO de .NET
}
