import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especificaciones'
})
export class EspecificacionesPipe implements PipeTransform {
  private translations: { [key: string]: string} ={
    'NOESPECIFICADO': 'NO ESPECIFICADO'
  };

  transform(value: string): string {
    if(!value) return '';
    return this.translations[value] ?? value;
  }

}
