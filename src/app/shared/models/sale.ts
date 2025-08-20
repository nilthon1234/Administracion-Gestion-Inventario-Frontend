// models/ticket.interface.ts
export interface Ticket {
  sellerName?: string;
  clientName?: string;
  clientLastName?: string;
  equipo?: string;
  contador?: string;
  dni: string;
}

// models/sale-detail.interface.ts
export interface SaleDetail {
  repositoryType: 'ALMACEN' | 'VITRINA' | 'VITRINAB';
  type: 'MEDIAS' | 'CANGURO' | 'ZAPATILLA'| 'BOTINES' | 'GORRA' | 'SANDALIA';
  ticketType: 'Registrado' | 'SeparacionCompletadaYRegistrado';
  payType: 'Plim' | 'Yape' | 'Cash' | 'Card' | 'Otros'| 'Debito';
  codToday: string;
  amount?: number;
  price: number;
  gender?: string;
  sizes?: number[];
}

// models/sale.interface.ts
export interface Sale {
  ticket: Ticket;
  details: SaleDetail[];
}

// models/gender.interface.ts
export interface Gender {
  id: number;
  nombre: string;
}

// models/size.interface.ts
export interface Size {
  id: number;
  talla: string;
}

// models/sizes-by-gender.interface.ts
export interface SizesByGender {
  hombre: Size[];
  mujer: Size[];
  niño: Size[];
  niña: Size[];
  bebé: Size[];
  
}

export interface ApiResponse {
  message?: string;
  error?: string;
}