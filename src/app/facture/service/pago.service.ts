import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Pago } from '../../shared/models/pago';
import { InfoSale } from '../../shared/models/Info-sale';
import { InformePagos } from '../../shared/models/InformePagos';
import { VentasPagos } from '../../shared/models/VentasPagos';
import { environment } from '../../../environments/environmen';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apiUrl = `${environment.apiUrl}/pago`;
  private apiPagoUrl = `${environment.apiUrl}/infosale`;

  constructor(private http: HttpClient) { }

  registrarPago(data: Pago[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, data, { responseType: 'text' });
  }

  registerTipoPago(data: InfoSale): Observable<any> {
    return this.http.post(`${this.apiPagoUrl}/save`, data, { responseType: 'text' })

  }
  getAllInfoSales(page: number = 0, size: number = 10): Observable<PaginatedResponse<InfoSale>> {
    return this.http.get<PaginatedResponse<InfoSale>>(`${this.apiPagoUrl}/all-info-sale`, {
      params: { page, size }
    });
  }
  getAllInformePagos(page: number = 0, size: number = 10): Observable<PaginatedResponse<InformePagos>> {
    return this.http.get<PaginatedResponse<InformePagos>>(`${this.apiPagoUrl}/all-meto-pago-info`, {
      params: { page, size }
    });
  }
  getAllVentaPagos(page: number = 0, size: number = 10): Observable<PaginatedResponse<VentasPagos>> {
    return this.http.get<PaginatedResponse<VentasPagos>>(`${this.apiUrl}/all-metodo-pago`, {
      params: { page, size }
    });
  }

  specifyPaymentMethods(payload: any): Observable<any> {
    return this.http.post(`${this.apiPagoUrl}/metodoPago`, payload, {
      responseType: 'text' // Forzamos a que espere una respuesta de tipo texto
    }).pipe(
      map(response => {
        try {
          // Intentamos parsear como JSON por si acaso
          return JSON.parse(response);
        } catch (e) {
          // Si no es JSON válido, devolvemos el texto plano
          return { message: response };
        }
      }),
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          return throwError({ message: 'Error de conexión' });
        } else {
          // Error del servidor
          try {
            // Intentamos parsear el error como JSON
            const parsedError = JSON.parse(error.error);
            return throwError(parsedError);
          } catch (e) {
            // Si no es JSON, devolvemos el texto plano
            return throwError({ message: error.error || error.statusText });
          }
        }
      })
    );
  }
}
