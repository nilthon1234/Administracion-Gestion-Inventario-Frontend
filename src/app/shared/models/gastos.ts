export interface Gastos {
    id?: number;
    descripcion: string;
    salida: number;
    contador: Contador;
    registrationSalida?: Date;
  }
  
  export enum Contador {
    ACTIVADO = 'ACTIVADO',
    ANULADO = 'ANULADO',
  }