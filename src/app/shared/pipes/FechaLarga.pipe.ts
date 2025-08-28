// src/app/shared/pipes/fecha-larga.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLarga'
})
export class FechaLarga implements PipeTransform {
    transform(value: string): string {
        // Asegurarse de que la fecha se interprete como local
        const parts = value.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Meses en JS empiezan en 0
        const day = parseInt(parts[2], 10);
    
        const date = new Date(year, month, day); // ← Esto crea una fecha en zona local
    
        return new Intl.DateTimeFormat('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
      }
}
