import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../../shared/models/sale';
import { blob } from 'node:stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseUrl = '/sale'

  constructor(private http: HttpClient) { }

  getResumen(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumen?fecha=${fecha}`);
  }

  getTickets(fecha: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ticket?fecha=${fecha}`);
  }

  registerSale(sale:Sale):Observable<any>{
    return this.http.post(`${this.baseUrl}/registerSale`, sale);
  }

  //reporte
  generateTicketPdf(ticketId: number): Observable<Blob>{
    return this.http.get(`${this.baseUrl}/${ticketId}/report`,{
      responseType:'blob'
    })
  }

  updateContador(id: number, contador: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/contador/${id}`, { contador });
  }

  downloadSalesReport(month: number, year: number): Observable<Blob> {;
  return this.http.get(`${this.baseUrl}/reporte/venta`, {
    params: { mes: month.toString(), anio: year.toString() },
    responseType: 'blob'
  });
}
}
