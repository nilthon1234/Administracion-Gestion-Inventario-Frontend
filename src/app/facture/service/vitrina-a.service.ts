import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vitrina, VitrinaRequest, VitrinaResponse } from '../../shared/models/vitrina';
import { ToastrService } from 'ngx-toastr';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class VitrinaAService {
  private urlVitrina = `${environment.apiUrl}/vitrina`


  constructor(private http: HttpClient,
              private toastr: ToastrService,
  ) { };

  buscarPorFiltros(
    brand?: string,
    color?: string,
    codToday?: string,
    company?: string,
    page: number = 0,
    size: number = 50,
    talla?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString()); // 👈 este 'size' es el tamaño de página
  
    if (brand) params = params.set('brand', brand);
    if (color) params = params.set('color', color);
    if (codToday) params = params.set('codToday', codToday);
    if (company) params = params.set('company', company);
    if (talla) params = params.set('talla', talla); // 👈 ahora usa 'talla', no 'size'
  
    return this.http.get<any>(`${this.urlVitrina}/list`, { params });
  }
  
  

  // Llamada al backend
  registrarProducto(request: VitrinaRequest): Observable<string> {
    return this.http.post(`${this.urlVitrina}/register`, request, { 
      responseType: 'text' 
    });
  }

  updateVitrina(data: any) : Observable<any>{
    return this.http.put<any>(`${this.urlVitrina}/updateVitrina`, data);
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

  //stock de inventario Vitrina
  getOutOfStock(page: number, size: number){
    return this.http.get<PaginatedResponse<Vitrina>>(`${this.urlVitrina}/sin-stock?pageNumber=${page}&pageSize=${size}`);
  }

  //visualizador de productos no  registrados en vitrina
  getVitrinaFaltantes(page: number = 0 ,size:number = 10): Observable<VitrinaResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<VitrinaResponse>(`${this.urlVitrina}/faltantes`,{params});
  }

  getByCodToday(codToday: string): Observable<Vitrina> {
    return this.http.get<Vitrina>(`${this.urlVitrina}/${codToday}`);
  }

  deleteByCodToday(codToday: string): Observable<string> {
    return this.http.delete(`${this.urlVitrina}/delete/${codToday}`, { responseType: 'text'});
  }

  eliminarSize(id: number, size: string): Observable<any> {
    
    return this.http.delete<string>(`${this.urlVitrina}/${id}/size/${size}`);
  }
  //no  funciona
  descontarCantidad(codToday: string, quantity: number) {
    return this.http.post(`${this.urlVitrina}/discount`, { codToday, quantity });
  }

  //Proceso  de actualizacion  aumentar y  descontar
  aumentarAmount(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.urlVitrina}/aumentar/${id}`, { cantidad }, { responseType: 'text' });
  }

  descontarAmount(id: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.urlVitrina}/descontar/${id}`, { cantidad }, { responseType: 'text' });
  }

}
