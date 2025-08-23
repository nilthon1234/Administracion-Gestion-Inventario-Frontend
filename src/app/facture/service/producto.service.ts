import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TipoItem } from '../../shared/models/TipoItem';
import { EntityGenero } from '../../shared/models/entityGenero';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private base = `${environment.apiUrl}/producto`;
  private baseGenero = `${environment.apiUrl}/genero`;

  constructor(private http: HttpClient) {}

  list(producto: 'calzados' | 'ropa' | 'unico'): Observable<TipoItem[]> {
    return this.http.get<TipoItem[]>(`${this.base}/${producto}`);
  }

  create(producto: 'calzados' | 'ropa' | 'unico', type: string, symbol?: string) {
    const params: any = { type };
    if (symbol) params.symbol = symbol;
    return this.http.post(`${this.base}/${producto}`, null, { params, responseType: 'text' });
  }
  delete(producto: 'calzados' | 'ropa' | 'unico', id: number): Observable<any> {
    return this.http.delete(`${this.base}/${producto}/${id}`, { responseType: 'text' });
  }
  listRopa(): Observable<string[]> {
    return this.list('ropa').pipe(
      map((items) => items.map(item => item.type))
    );
  }
  //Genero Lista
  createGenero(nombre: string): Observable<any> {
    const body = { nombre: nombre };
    return this.http.post(`${this.baseGenero}`, body);
  }

  listarGeneros(): Observable<any[]> {
    return this.http.get<EntityGenero[]>(this.baseGenero);
  }
}
