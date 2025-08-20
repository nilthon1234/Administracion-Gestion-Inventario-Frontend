export interface SlipperDTO {
  entity: any | null; // Replace 'any' with a more specific type if needed
  id: number;
  brand: string;
  codToday: string;
  amount: number;
  image: string;
  company: string;
  price: number;
  registrationDate: string; // or Date if you prefer to handle it as a Date object
  urlImg: string | null;
  type: string;
  genero: string;
  sizes: {
    s: number;
    xl: number;
    xs: number;
    l: number;
    m: number;
  };
  repositoryType: string;
}
export type SizeKey = 's' | 'm' | 'l' | 'xl' | 'xs';

