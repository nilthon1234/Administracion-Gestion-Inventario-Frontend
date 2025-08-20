// repository-type-color.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repositoryTypeColor'
})
export class RepositoryTypeColorPipe implements PipeTransform {
  transform(type: string | undefined): string {
    // Si es undefined o null, devolvemos la clase por defecto
    if (!type) {
      return 'badge-default';
    }

    const typeLower = type.toLowerCase().trim();

    const classMap: { [key: string]: string } = {
      'almacen': 'badge-alacena',
      'vitrina': 'badge-vitrina',
      'vitrinab': 'badge-closet',
      'mesa': 'badge-mesa'
    };

    return classMap[typeLower] || 'badge-default';
  }
}