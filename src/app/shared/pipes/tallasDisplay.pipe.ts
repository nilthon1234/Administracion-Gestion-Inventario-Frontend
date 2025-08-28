// talla-display.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tallaDisplay'
})
export class TallaDisplayPipe implements PipeTransform {
  transform(value: string | number): string {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value.toString();
  }
}