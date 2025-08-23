import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class AmortizationService {

  private apiUrl = `${environment.apiUrl}/amortization`;

  constructor(private http: HttpClient) { }

   registerAmortization(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
