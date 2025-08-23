import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  private apiUrl = `${environment.apiUrl}/api`

  constructor(private http: HttpClient) { }

  generateQrCodes(data: any[]): Observable<Blob> {
    // Transformar los datos del listado al formato requerido por la API
    const requestData = data.map(item => ({
      tableName: this.mapGeneroToTableName(item.genero),
      brand: item.brand,
      codToday: item.codToday,
      company: item.company,
      quantity: item.amount * 2,
    }));

    return this.http.post(`${this.apiUrl}/reports/qr-codes`, requestData, { responseType: 'blob' });
  }

  private mapGeneroToTableName(genero: string): string {
    const generoMap: { [key: string]: string } = {
      'Hombre': 'man',
      'Mujer': 'women',
      'Niño': 'child',
      'Niña': 'littlegirl',
      'Bebe': 'baby'
    };

    return generoMap[genero] || genero;
  }


}
