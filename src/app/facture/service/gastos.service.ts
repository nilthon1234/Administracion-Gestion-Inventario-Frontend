import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environmen';
import { Contador, Gastos } from '../../shared/models/gastos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GastosService {
  private apiUrl = `${environment.apiUrl}/api/gastos`;

  constructor(private http: HttpClient) { }

  crearGasto(gasto: Gastos): Observable<string> {
    return this.http.post(this.apiUrl, gasto, { responseType: 'text' });
  }

  actualizarGasto(id: number, gasto: Gastos): Observable<string> {
    return this.http.put(`${this.apiUrl}/${id}`, gasto, { responseType: 'text' });
  }

  eliminarGasto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerGastosPorMes(fecha: Date): Observable<Gastos[]> {
    const params = { fecha: fecha.toISOString() };
    return this.http.get<Gastos[]>(`${this.apiUrl}/mes`, { params });
  }

  actualizarContador(id: number, contador: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/contador`, { contador });
  }
  
}
