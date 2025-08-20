export interface GananciaMensual {
  mes: string;
  totalMes: number;
}

export interface GananciaAnual {
  meses: GananciaMensual[];
  totalAnual: number;
}