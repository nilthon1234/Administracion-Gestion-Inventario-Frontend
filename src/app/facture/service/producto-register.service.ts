import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';
import { Slipper } from '../../shared/models/slippert';
import { environment } from '../../../environments/environmen';
export interface Marcas {
  id: number;
  nombre: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProductoRegisterService {
  
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getMarcas(): Observable<Marcas[]> {
    return this.http.get<Marcas[]>(`${this.baseUrl}/brand/lista-marcas`);
  }

  // Obtener tipos
  getTipos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/cod-today/tipos`);
  }

  // Crear código hoy
  createCodToday(
    tableName: string,
    brand: string,
    company: string,
    precio: number,
    type: string,
    file: File
  ): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.baseUrl}/cod-today/${tableName}/${brand}/${company}/${precio}/${type}`,
      formData,
      { responseType: 'text' }  // Esto es clave para recibir texto plano
    );
  }

  // Obtener slippers por fecha
  getSlippersByDate(
    fecha: string,
    page: number = 0,
    size: number = 5
  ): Observable<PaginatedResponse<Slipper>> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Slipper>>(
      `${this.baseUrl}/filter-slipper/date-slipper`,
      { params }
    );
  }
}
