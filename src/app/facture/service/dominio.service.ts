import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class DominioService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/dominio`;

  actualizarDominio(nuevoDominio: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/actualizar`, { nuevoDominio }, { responseType: 'text' });
  }
  getDominio():Observable<any>{
    return this.http.get(`${this.apiUrl}/actual`,{responseType: 'text'})
  }
}
