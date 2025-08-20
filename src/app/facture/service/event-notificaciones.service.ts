import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../shared/models/PaginatedResponse';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventNotificacionesService {

   private apiUrl = 'http://localhost:80/notificaciones';

  constructor(private http: HttpClient) { }

  getNotifications(page: number = 0, size: number = 10): Observable<PaginatedResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/lista-notificaciones`, { params });
  }
}
