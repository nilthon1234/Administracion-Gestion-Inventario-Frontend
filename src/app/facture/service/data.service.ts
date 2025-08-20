import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TallasPorGenero } from '../../shared/models/vitrina';
import { environment } from '../../../environments/environmen';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private urlMarca = `${environment.apiUrl}/brand`
  private urlGenero = `${environment.apiUrl}/genero`
  // private urlMarca = 'http://localhost:80/brand'
  // private urlGenero = 'http://localhost:80/genero'

  constructor(private http: HttpClient) { }

  getGenero(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlGenero}`);
  }

  getMarca(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlMarca}/lista-marcas`);
  }
 
  getTalla(): Observable<any[]> {
    return this.http.get<any[]>('assets/data/tallas.json');
  }

  //para vitrina seleccion de tallas 
  getTallas(): Observable<TallasPorGenero> {
    return this.http.get<TallasPorGenero>('assets/data/tallas.json');
  }

  saveMarca(nombre: string): Observable<string> {
  return this.http.post(
    `${this.urlMarca}/save`,
    { nombre },
    { responseType: 'text' }
  );
}
  deleteMarca(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlMarca}/${id}`);
  }
  upDateMarca( id: number, nombre: string): Observable<any> {
    return this.http.put<any>(`${this.urlMarca}/${id}`,{ nombre });
  }
}
