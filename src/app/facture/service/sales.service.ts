import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sale } from '../../shared/models/sale';
import { blob } from 'node:stream/consumers';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseUrl = `${environment.apiUrl}/sale`

  constructor(private http: HttpClient) { }

  getResumen(fecha: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resumen?fecha=${fecha}`);
  }

  getTickets(fecha: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ticket?fecha=${fecha}`);
  }

  registerSale(sale: Sale): Observable<any> {
    return this.http.post(`${this.baseUrl}/registerSale`, sale);
  }

  //reporte
  generateTicketPdf(ticketId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${ticketId}/report`, {
      responseType: 'blob'
    })
  }

  updateContador(id: number, contador: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/contador/${id}`, { contador });
  }

  downloadSalesReport(month: number, year: number): Observable<Blob> {
    ;
    return this.http.get(`${this.baseUrl}/reporte/venta`, {
      params: { mes: month.toString(), anio: year.toString() },
      responseType: 'blob'
    });
  }

  generarReporteCierreCaja(fecha: string): Observable<Blob> {
    // El backend espera dd-MM-yyyy, transformamos la fecha yyyy-MM-dd -> dd-MM-yyyy
    const partes = fecha.split('-'); // [yyyy, MM, dd]
    const fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;

    return this.http.get(`${this.baseUrl}/reporte-cierre-caja`, {
      params: { fecha: fechaFormateada },
      responseType: 'blob', // muy importante para PDF
    });
  }
}
