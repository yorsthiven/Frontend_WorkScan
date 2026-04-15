/**
 * Transforma un texto a Capital Case (Mayúscula Inicial).
 * Ejemplo: "GEORGE medina" -> "George Medina"
 */
export const capitalizarFrase = (texto: string): string => {
  if (!texto) return '';
  return texto
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * Ejemplo de otra utilidad que podrías necesitar en WorkScan:
 * Formatea un número a moneda colombiana o similar.
 */
export const formatCurrency = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};
