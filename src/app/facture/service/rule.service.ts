import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  private apiUrl = `${environment.apiUrl}/rule`;

  constructor(private http: HttpClient) {}

  // Obtener valor por keyName
  getRuleValue(keyName: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${keyName}`);
  }

  // Actualizar valor por keyName
  updateRuleValue(keyName: string, value: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${keyName}`, value);
  }
}
