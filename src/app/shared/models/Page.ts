export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // número de página actual (empieza en 0)
  size: number;   // tamaño de página
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}
