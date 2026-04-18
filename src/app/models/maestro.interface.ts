export interface DatoMaestro {
  id: number;
  nombre: string;
  descripcion?: string; // Opcional para tablas que tengan un segundo dato
  material?: string;    // Específico para Items
}
