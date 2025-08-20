import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmortizationService {

  private apiUrl = 'http://localhost:80/amortization';

  constructor(private http: HttpClient) { }

   registerAmortization(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
}
