import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class TicketConfigService {

  private baseUrl = `${environment.apiUrl}/api/ticket-config`;

  constructor(private http: HttpClient) {}

  updateTicketConfig(newValue: number): Observable<string> {
    const params = new HttpParams().set('newValue', newValue.toString());
    return this.http.put(`${this.baseUrl}/update`, null, { params, responseType: 'text' });
  }
}
