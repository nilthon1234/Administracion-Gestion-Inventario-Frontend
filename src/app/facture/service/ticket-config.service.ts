import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketConfigService {

  private baseUrl = 'http://localhost:80/api/ticket-config';

  constructor(private http: HttpClient) {}

  updateTicketConfig(newValue: number): Observable<string> {
    const params = new HttpParams().set('newValue', newValue.toString());
    return this.http.put(`${this.baseUrl}/update`, null, { params, responseType: 'text' });
  }
}
