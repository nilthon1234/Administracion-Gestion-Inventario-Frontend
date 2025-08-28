import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Devoluciones } from '../../shared/models/devoluciones';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../../shared/models/DescarteResponse';
import { environment } from '../../../environments/environmen';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private urlDev = `${environment.apiUrl}/devoluciones`

  constructor(private http: HttpClient) { }
  

  getAllDevoluciones(page: number = 0, size: number = 10): Observable<PaginatedResponse<Devoluciones>> {
    return this.http.get<PaginatedResponse<Devoluciones>>(`${this.urlDev}/all-devoluciones`, {
      params: { page, size }
    });
  }

  devolucionVenta(){}

  deleteSeparation(id: number):Observable<SuccessResponse>{
    return this.http.delete<SuccessResponse>(`${this.urlDev}/${id}`);
  }
}
