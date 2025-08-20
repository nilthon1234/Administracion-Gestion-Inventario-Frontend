import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'payTypeTranslate'
})
export class PayTypeTranslatePipe implements PipeTransform {

  private translations: { [key: string]: string} = {
    'Cash': 'Efectivo',
    'Card': 'Tarjeta'
  };

  transform(value: string): string {
    if(!value) return '';
    return this.translations[value] ?? value;
  }

}
