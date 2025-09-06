export interface Vitrina {
    id:               number;
    store:            string;
    brand:            string;
    codToday:         string;
    amount:           number;
    image:            string;
    color:            string;
    url: string; 
    company:          string;
    genero?: string;
    type: string;
    size:             string;
    registrationDate: Date;
    stockAlmacen?: string; 
    isEnlarged?: boolean;
    producto?: string;
}

export interface TallaItem {
  id: string;
  talla: string;
}

export interface GeneroItem {
  id: number;
  nombre: string;
}

export interface TallasPorGenero {
  [key: string]: TallaItem[];
}

export interface VitrinaRequest {
  codToday: string;
  company: string;
  type: string;
  tallas: string[];
}
export interface VitrinaResponse {
  content: Vitrina[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
