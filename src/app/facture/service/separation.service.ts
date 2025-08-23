import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Separation } from '../../shared/models/separation';
import { Client, Separations } from '../../shared/models/client';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class SeparationService {
  
  private apiUrl = `${environment.apiUrl}/separation`;

  constructor(private http: HttpClient) { }

  saveSeparation(separation: Separations): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/save`, separation)
      .pipe(
        catchError(this.handleError<string>('saveSeparation', ''))
      );
  }

  getAllSeparations(): Observable<Separation[]> {
    return this.http.get<Separation[]>(`${this.apiUrl}/list-all`);
  }

  getAllClients(page: number = 0, size: number = 5): Observable<any> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/client-details`,{params});
  }

  //update separation
  updateSeparation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-separation/${id}`, data,{ responseType: 'text' });
  }

  //pdf 
  generateClientPdf(clientId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/client/${clientId}/pdf`, {
      responseType: 'blob' // Importante para manejar la respuesta como archivo
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
