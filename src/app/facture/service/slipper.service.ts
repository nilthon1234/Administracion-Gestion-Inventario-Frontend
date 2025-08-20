import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Resumenes } from '../../shared/models/resumenes';
import { TiposResponse } from '../dashboard/usuario-dashboard/components/filter-vitrina-slipper/filter-vitrina-slipper.component';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class SlipperService {
  private urlCod = `${environment.apiUrl}/cod-today`
  private urlSlipper = `${environment.apiUrl}/slipper`

  // private urlCod = 'http://localhost:80/cod-today'
  // private urlSlipper = 'http://localhost:80/slipper'

  readonly generoMap: { [key: string]: string } = {
    hombre: 'MAN',
    mujer: 'WOMEN',
    niño: 'CHILD',
    niña: 'LITTLEGIRL',
    bebe: 'BABY',
  }

  constructor(private http: HttpClient) { }

  getGeneroKey(generoSeleccionado: string): string {
    return this.generoMap[generoSeleccionado.toLowerCase()] ?? generoSeleccionado;
  }

  submitAdjustments(
    slipper: any,
    genero: string,
    adjustments: { [key: string]: number },
    isAdd: boolean
  ): Observable<any> {
    const payload: { [key: string]: number } = {};
    for (const [key, val] of Object.entries(adjustments)) {
      if ((isAdd && val > 0) || (!isAdd && val < 0)) {
        payload[key] = Math.abs(val);
      }
    }
    if (Object.keys(payload).length == 0) {
      throw new Error('Payload vacio, no se envioaron nada.');
    }
    const url = isAdd
      ? `${this.urlSlipper}/update-size/${genero}/${slipper.brand}/${slipper.codToday}`
      : `${this.urlSlipper}/discount/${genero}/${slipper.brand}/${slipper.codToday}`;
    return this.http.put(url, payload);
  }

  generoTipo(): Observable<string[]> {
    return this.http.get<string[]>(`${this.urlCod}/tipos`);
  }
  generoTipos(): Observable<TiposResponse> {
  return this.http.get<TiposResponse>(`${this.urlCod}/tipos-vitrinas`);
}

  createCodToday(tableName: String, brand: string, company: string,precio: number, type: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file)
    return this.http.post<string>(`${this.urlCod}/${tableName}/${brand}/${company}/${precio}/${type}`, formData, { responseType: 'text' as 'json' });
  }

  eliminarSlipper(codToday: string) {
    return this.http.delete(`${this.urlCod}/slipper-delete/${codToday}`, { responseType: 'text' })
  }

  updateImagen(tableType: string, brand: string, codToday: string, file: File): Observable<string> {
    const formaData = new FormData();
    formaData.append('file', file);
    return this.http.put<string>(`${this.urlSlipper}/update-file/${tableType}/${brand}/${codToday}`, formaData,
      { responseType: 'Text' as 'json' }
    );

  }
  actualizarProducto(payload: any) {
    return this.http.put(`${this.urlSlipper}/update`, payload, {
      responseType: 'text'
    });
  }

  disminuirProducto(payload: any) {
    return this.http.put(`${this.urlSlipper}/discount`, payload, {
      responseType: 'text'
    });
  }

   getResumen(): Observable<Resumenes> {
    return this.http.get<Resumenes>(`${this.urlSlipper}/resumen-productos`);
  }
  updatePrice(codToday: string, newPrice: string): Observable<string> {
    const params = new HttpParams()
      .set('codToday', codToday)
      .set('newPrice', newPrice);

    return this.http.put(`${this.urlCod}/update-price`, null, { params, responseType: 'text' });
  }

}
