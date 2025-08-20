import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenSizes'
})
export class OrdenSizesPipe implements PipeTransform {

  transform(sizes: any[]): any[] {
    if (!sizes) return [];

    return [...sizes].sort((a, b) => {
      const getNumericValue = (name: string): number => {
        // Elimina el prefijo (eu, usa, etc.) y convierte _ a .
        const cleaned = name.replace(/^[a-zA-Z]+/, '').replace('_', '.');
        return parseFloat(cleaned);
      };

      return getNumericValue(a.name) - getNumericValue(b.name);
    });
  }

}
