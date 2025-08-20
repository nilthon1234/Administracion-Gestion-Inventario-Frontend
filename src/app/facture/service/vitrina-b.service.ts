import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vitrina, VitrinaRequest, VitrinaResponse } from '../../shared/models/vitrina';
import { ToastrService } from 'ngx-toastr';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';

@Injectable({
  providedIn: 'root'
})
export class VitrinaBService {
  private urlVitrinaB = 'http://localhost:80/vitrina-b'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
  ) { }

  buscarPorFiltros(brand?: string,
    codToday?: string,
    company?: string,
    page: number = 0,
    size: number = 50
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (brand) params = params.set('brand', brand);
    if (codToday) params = params.set('codToday', codToday);
    if (company) params = params.set('company', company);
    return this.http.get<any>(`${this.urlVitrinaB}/list`, { params })

  }
  // Llamada al backend
  registrarProducto(request: VitrinaRequest): Observable<string> {
    return this.http.post(`${this.urlVitrinaB}/register`, request, { 
      responseType: 'text' 
    });
  }

  updateVitrina(data: any): Observable<any> {
    return this.http.put<any>(`${this.urlVitrinaB}/updateVitrina`, data);
  }

  //toastr
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Éxito', {
      positionClass: 'toast-middle-center',
    });
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Error', {
      positionClass: 'toast-middle-center',
    });
  }

  //stock de inventario VitrinaB
  getOutOfStock(page: number, size: number) {
    return this.http.get<PaginatedResponse<Vitrina>>(`${this.urlVitrinaB}/sin-stock?pageNumber=${page}&pageSize=${size}`);
  }

  //visualizador de productos no  registrados en vitrina
  getVitrinaFaltantes(page: number = 0, size: number = 10): Observable<VitrinaResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<VitrinaResponse>(`${this.urlVitrinaB}/faltantes`, { params });
  }

  getByCodToday(codToday: string): Observable<Vitrina> {
    return this.http.get<Vitrina>(`${this.urlVitrinaB}/${codToday}`);
  }

  deleteByCodToday(codToday: string): Observable<string> {
    return this.http.delete(`${this.urlVitrinaB}/delete/${codToday}`, { responseType: 'text'});
  }
  
  eliminarSize(id: number, size: string): Observable<any> {
    
    return this.http.delete<string>(`${this.urlVitrinaB}/${id}/size/${size}`);
  }
  //no  funciona
  descontarCantidad(codToday: string, quantity: number) {
    return this.http.post(`${this.urlVitrinaB}/discount`, { codToday, quantity });
  }

  //Proceso  de actualizacion  aumentar y  descontar
  aumentarAmount(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.urlVitrinaB}/aumentar/${id}`, { cantidad }, { responseType: 'text' });
  }

  descontarAmount(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.urlVitrinaB}/descontar/${id}`, { cantidad }, { responseType: 'text' });
  }
}
