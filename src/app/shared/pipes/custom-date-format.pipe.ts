import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat'
})
export class CustomDateFormatPipe implements PipeTransform {

  private meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  transform(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    const dia = date.getDate();
    const mes = this.meses[date.getMonth()];
    const anio = date.getFullYear();

    let hora = date.getHours();
    const minuto = date.getMinutes().toString().padStart(2, '0');

    const ampm = hora >= 12 ? 'PM' : 'AM';
    hora = hora % 12;
    hora = hora === 0 ? 12 : hora; // Ajuste para mostrar 12 en vez de 0

    const horaStr = hora.toString().padStart(2, '0');

    return `${dia} de ${mes} de ${anio} ${horaStr}:${minuto} ${ampm}`;
  }
}
