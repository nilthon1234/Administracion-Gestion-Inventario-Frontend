import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slipper } from '../../shared/models/slippert';
import { Observable } from 'rxjs';
import { Page } from '../../shared/models/Page';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';
import { SlipperDTO } from '../../shared/models/slippertDTO';
import { environment } from '../../../environments/environmen';


interface ProductResult {
  entity: any;
  id: number;
  brand: string;
  codToday: string;
  amount: number;
  image: any;
  company: string;
  producto: string;
  price: number;
  registrationDate: string;
  urlImg: string;
  type: string;
  genero: string;
  repositoryType: string;
  sizes: any;
}

@Injectable({
  providedIn: 'root'
})
export class FilterSlipperService {

  private urlCod = `${environment.apiUrl}/filter-slipper`;
  //private urlCod = 'http://localhost:80/filter-slipper';


  constructor(private http: HttpClient) { };


  buscarZapatillasPage(genero: string, brand?: string, type?: string, size?: string, page: number = 0, sizePag: number = 100): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('tamaño', sizePag.toString());

    if (brand) params = params.set('brand', brand);
    if (type) params = params.set('type', type);
    if (size) params = params.set('size', size);

    return this.http.get<any>(`${this.urlCod}/${genero}`, { params });
  }

  buscarZapatillasPorFecha(genero: string, date: string, brand?: string, size?: string, page: number = 0, sizePag: number = 100): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('tamaño', sizePag.toString());

    if (date) params = params.set('date', date);
    if (brand) params = params.set('brand', brand);
    if (size) params = params.set('size', size);
    return this.http.get<any>(`${this.urlCod}/search/${genero}`, { params })
  }

  // buscarPorCodTodayOCompany(genero: string, brand: string, codToday?: string, company?: string): Observable<Slipper[]> {
  //   let params = new HttpParams();
  //   if (codToday) params = params.set('codToday', codToday);
  //   if (company) params = params.set('company', company);
  //   return this.http.get<Slipper[]>(`${this.urlCod}/${genero}/${brand}/details`, { params })
  // }

  buscarPorCodTodayOCompany(codToday?: string, company?: string): Observable<Slipper[]> {
  let params = new HttpParams();
  if (codToday) params = params.set('codToday', codToday);
  if (company) params = params.set('company', company);
  return this.http.get<Slipper[]>(`${this.urlCod}/search-cod-companny`, { params });
}
// En tu FilterSlipperService, cambia esta línea:
buscarPorCodTodayOCompany2(codToday?: string, company?: string): Observable<Slipper[]> {
  let params = new HttpParams();
  if (codToday) params = params.set('codToday', codToday);
  if (company) params = params.set('company', company);
  return this.http.get<Slipper[]>(`${this.urlCod}/search-cod-companny-vitrina`, { params });
}
buscarPorCodTodayOCompany3(codToday?: string, company?: string): Observable<ProductResult[]> {
  let params = new HttpParams();
  if (codToday) params = params.set('codToday', codToday);
  if (company) params = params.set('company', company);
  return this.http.get<ProductResult[]>(`${this.urlCod}/search-cod-companny-producto`, { params });
}

  listAllSlipper(fecha: string, page: number = 0, size: number = 3000): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.urlCod}/date-slipper?fecha=${fecha}&page=${page}&size=${size}`, { params });
  }

  listAllProduct(page: number = 0, sizePag: number = 100): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('tamaño', sizePag.toString());

    return this.http.get<any>(`${this.urlCod}/gorra-cangu-me`, { params })
  }

  //stock  de inventario

  getOutOfStock(page: number, size: number) {
    return this.http.get<PaginatedResponse<Slipper>>(`${this.urlCod}/out-of-stock?pageNumber=${page}&pageSize=${size}`);
  }
  buscarPorCodToday(codToday: string): Observable<any> {
    return this.http.get(`${this.urlCod}/buscar?codToday=${codToday}`);
  }
  listarPorPantalonPoleraPolo(
    pageNumber: number,
    pageSize: number,
    codToday?: string,
    company?: string,
    size?: string
  ): Observable<PaginatedResponse<SlipperDTO>> {
    const params: any = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    };

    if (codToday) {
      params.codToday = codToday;
    }
    if (company) {
      params.company = company;
    }
    if (size) {
      params.size = size;
    }

    return this.http.get<PaginatedResponse<SlipperDTO>>(
      `${this.urlCod}/pantalon-polera-polo`,
      { params }
    );
  }
  updateSize(genero: string, brand: string, codToday: string, payload: any) {
    const url = `http://localhost:80/slipper/update-size/${genero}/${brand}/${codToday}`;
    return this.http.put(url, payload);
  }

  discountSize(genero: string, brand: string, codToday: string, payload: any) {
    const url = `http://localhost:80/slipper/discount/${genero}/${brand}/${codToday}`;
    return this.http.put(url, payload);
  }




}


