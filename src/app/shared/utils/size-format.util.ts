// size-format.util.ts
export function formatSizes(value: string | string[], type?: string): string[] {
    if (!value) return [];
  
    // Convertir el valor a un arreglo si es una cadena
    const sizes = Array.isArray(value) ? value : value.toString().split(',').map(s => s.trim()).filter(s => s !== '');
  
    // Tipos que usan tallas basadas en letras
    const letterSizeTypes = ['PANTALON', 'POLO', 'POLERA'];
  
    // Convertir tallas a mayúsculas si el tipo está en letterSizeTypes
    if (type && letterSizeTypes.includes(type.toUpperCase())) {
      return sizes.map(size => size.toUpperCase());
    }
  
    // Para otros tipos (ZAPATILLA, SANDALIA), convertir a números y devolver como strings
    return sizes.map(size => {
      const numStr = size.replace(/^eu|^usa/i, '').replace('_', '.');
      const num = parseFloat(numStr);
      return isNaN(num) ? size : num.toString();
    });
  }
  