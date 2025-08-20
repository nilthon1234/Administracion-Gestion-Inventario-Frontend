import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiResponse, Gender, Sale, SizesByGender } from '../../shared/models/sale';
import { GananciaAnual } from '../../shared/models/gananciasAnuales';
import { ProductSalesByType } from '../../shared/models/productosSalesByType';

@Injectable({
  providedIn: 'root'
})
export class SaleDataService {
  private apiUrl = 'http://localhost:80';

  constructor(private http: HttpClient) { }

  registerSale(sale: Sale): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/sale/registerSale`, sale)
      .pipe(
        catchError(error => {
          // Si el backend devuelve un error estructurado
          if (error.error) {
            return of(error.error);
          }
          // Para otros tipos de errores
          return of({ error: 'Error de conexión con el servidor' });
        })
      );
  }

  getGenero(): Observable<Gender[]> {
    return this.http.get<Gender[]>('assets/data/genero.json')
      .pipe(
        catchError(this.handleError<Gender[]>('getGenero', []))
      );
  }

  getTalla(): Observable<SizesByGender> {
    return this.http.get<SizesByGender>('assets/data/tallas.json')
      .pipe(
        catchError(this.handleError<SizesByGender>('getTalla', {} as SizesByGender))
      );
  }


  updateSlipperSales(payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/sale/update-detail`, payload, { responseType: 'text' });
  }

  getGananciasAnuales(anio: number): Observable<GananciaAnual> {
    return this.http.get<GananciaAnual>(`${this.apiUrl}/sale/anuales/${anio}`);
  }

  getData(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sale/estadisticas-pagos?fecha=${fecha}`);
  }
  searchTicketsByDniOrTicket(dni?: string, ticket?: string): Observable<any[]> {
  let params = new HttpParams();

  if (dni) {
    params = params.set('dni', dni);
  }
  if (ticket) {
    params = params.set('ticket', ticket);
  }

  return this.http.get<any[]>(`${this.apiUrl}/sale/search-ticket-dni`, { params });
}

  getTopSellingProductsByType(limit: number = 10): Observable<ProductSalesByType[]> {
    return this.http.get<ProductSalesByType[]>(`${this.apiUrl}/sale/top-selling-by-type?limit=${limit}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  private clientData: any;
  setClientData(data: any) { this.clientData = data; }
  getClientData() { return this.clientData; }
}
