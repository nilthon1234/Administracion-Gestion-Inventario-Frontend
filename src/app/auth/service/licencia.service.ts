import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Observable, catchError, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LicenciaService {
  private urlLicen = 'http://localhost:9090/api/licencia';

  constructor(private http: HttpClient) { }

  async getFingerprint(): Promise<string> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  }

  validarLicencia(licencia: string, fingerprint: string): Observable<any> {
    return this.http.post<any>(`${this.urlLicen}/validar`, {
      licencia,
      fingerprint
    }).pipe(
      catchError(this.handleError)
    );
  }

  verificarToken(token: string, fingerprint: string): Observable<any> {
    return this.http.post(`${this.urlLicen}/verificar`, {
      token,
      fingerprint
    }, { responseType: 'text' }).pipe( // Cambia el responseType a 'text'
      map(response => {
        // Verifica si la respuesta es "Token Valido" o similar
        if (response.includes('Token Valido')) {
          return { valid: true };
        }
        throw new Error('Token inválido');
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {

    let errorMsg = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMsg = `Código: ${error.status}, mensaje: ${error.message}`;

      // Log detallado de la respuesta del servidor
      if (error.error) {
        console.error('Detalle de error del servidor:', error.error);
      }
    }

    return throwError(() => errorMsg);
  }
}
