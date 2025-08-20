import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Devoluciones } from '../../shared/models/devoluciones';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../../shared/models/DescarteResponse';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private urlDev = 'http://localhost:80/devoluciones'

  constructor(private http: HttpClient) { }
  

  allListaDevoluciones():Observable <Devoluciones[]>{
    return this.http.get<Devoluciones[]>(`${this.urlDev}/all-devoluciones`)
  }

  devolucionVenta(){}

  deleteSeparation(id: number):Observable<SuccessResponse>{
    return this.http.delete<SuccessResponse>(`${this.urlDev}/${id}`);
  }
}
