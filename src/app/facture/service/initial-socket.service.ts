import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environmen';

@Injectable({
  providedIn: 'root'
})
export class InitialSocketService {


  private apiUrl = 'http://localhost:80/scanner';
  private client: Client;
  private listaSubject = new BehaviorSubject<any[]>([]);
  lista$ = this.listaSubject.asObservable();

  constructor(private http: HttpClient) {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-register`),
      reconnectDelay: 1000,
    });
  }
  // 👇 Nuevo: estado de conexión
  private connectedSubject = new BehaviorSubject<boolean>(false);
  connected$ = this.connectedSubject.asObservable();

  connect(maquina: string): void {
    this.client.onConnect = () => {
      this.client.subscribe(`/topic/register-scanners/${maquina}`, (msg: IMessage) => {
        const data = JSON.parse(msg.body);
        this.listaSubject.next(data);
        
        this.connectedSubject.next(true);
      });

      this.client.publish({
        destination: '/app/getListByMachine',
        body: maquina,
      });
    };

    this.client.activate();
  }
}