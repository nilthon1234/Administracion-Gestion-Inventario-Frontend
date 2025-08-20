import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
import { ApiResponse, Sale } from '../../shared/models/sale';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterScannerWebsocketService {


  private apiUrl = 'http://localhost:80/scanner';
  private client: Client;
  private listaSubject = new BehaviorSubject<any[]>([]);
  lista$ = this.listaSubject.asObservable();

  constructor(private http: HttpClient) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:80/ws-register'),
      reconnectDelay: 1000,
    });
  }

  connect(maquina: string): void {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/register-scanners/${maquina}`, (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        this.listaSubject.next(data);
      });

      this.client.publish({
        destination: '/app/getListByMachine',
        body: maquina,
      });
    };

    this.client.activate();
  }

  registerSale(sale: Sale): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/registerSale`, sale)
      .pipe(
        catchError(error => {
          // Si el backend devuelve un error estructurado
          if (error.error) {
            return of(error.error);
          }
          // Para otros tipos de errores
          return of({ error: 'Error de conexión con el servidor' });
        })
      );
  }
  eliminarTalla(id: number, talla: string) {
    this.client.publish({
      destination: '/app/deleteSize',
      body: JSON.stringify({ id, size: talla })
    });
  }
  deleteRegisterById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el registro:', error);
        return throwError(() => new Error('No se pudo eliminar el registro.'));
      })
    );
  }

}
