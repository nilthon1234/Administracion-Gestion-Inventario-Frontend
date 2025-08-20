export interface TipoItem {
  id: number;
  type: string;
  symbol?: string;
  producto: 'CALZADO' | 'ROPA' | 'UNICO';
}