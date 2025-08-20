export type SeparationType = 'AMORTIZANDOCE' | 'NUEVO' | 'CANCELED' | string;

export interface Separation {
  id: number;
  idClient: {
    id: string;
    name: string;
    lastName: string;
    dni: number;
    total: number;
    separationType: SeparationType;
  };
  codToday: string;
  size: string;
  amount: number;
  price: number;
  subTotal: number;
}
