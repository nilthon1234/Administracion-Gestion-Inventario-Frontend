export interface Separation {
  id: string;
  idClient: string;
  codToday: string;
  repositoryType: string;
  genero: string;
  type?: string,
  size: string;
  amount: number;
  price: number;
  subTotal: number;
  producto: string;
}

export interface Amortization {
  idClient?: string;
  account: number;
  pay: string;
  registrationAmortization?: string;
}

export interface Client {
  connect(arg0: {}, arg1: () => void): unknown;
  id?: string;
  name: string;
  lastName: string;
  dni: number;
  faltante: number
  total?: number;
  separationType: string;
  separations: Separation[];
  amortizations: Amortization[];
  totalAmortizations?: number;
}

export interface Separations{

  client: Client;
  detailsSeparation: Separation[];
  detailsAmortization: Amortization[];

}

