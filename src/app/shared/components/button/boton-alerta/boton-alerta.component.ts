import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FilterSlipperService } from '../../../../facture/service/filter-slipper.service';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Client, StompSubscription } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import SockJS from 'sockjs-client';
import { environment } from '../../../../../environments/environmen';

@Component({
  selector: 'app-boton-alerta',
  imports: [CommonModule],
  templateUrl: './boton-alerta.component.html',
  styleUrl: './boton-alerta.component.css',
  animations: [
    trigger('numberChange', [
      state('normal', style({
        transform: 'scale(1)',
      })),
      state('enlarged', style({
        transform: 'scale(1.5)', // Aumenta el tamaño un 50%
      })),
      transition('normal => enlarged', [
        animate('200ms ease-in') // Animación de agrandamiento
      ]),
      transition('enlarged => normal', [
        animate('200ms ease-out') // Regresa al tamaño normal
      ])
    ])
  ]
})

export class BotonAlertaComponent implements OnInit, OnDestroy {

  showAlert = false;
  lowStockCount = 0;
  animationState = 'normal';
  private stompClient: Client | null = null;
  private subscription: StompSubscription | null = null;
  private dismissedCount: number | null = null;
  private dismissedDate: string | null = null;
  private lastProcessedCount: number | null = null; // Para evitar procesar el mismo valor repetidamente

  constructor(
    private stockService: FilterSlipperService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const today = this.getLocalDate();
    const dismissInfo = localStorage.getItem('lowStockDismissInfo');
    if (dismissInfo) {
      try {
        const parsed = JSON.parse(dismissInfo);
        this.dismissedDate = parsed.date;
        this.dismissedCount = parsed.count;
      } catch (e) {
        console.error('Error parsing lowStockDismissInfo:', e);
      }
    }

    this.stockService.getLowStock(0, 5).subscribe({
      next: (res) => {
        this.lowStockCount = res.content?.length || 0;
        this.lastProcessedCount = this.lowStockCount;
        this.showAlert = this.lowStockCount > 0;
        console.log('Initial load:', { lowStockCount: this.lowStockCount, showAlert: this.showAlert });
      },
      error: (err) => {
        console.error('Error fetching low stock:', err);
        this.lowStockCount = 0;
        this.showAlert = false;
      }
    });

    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws-register`),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Conectado a WebSocket');
      this.subscription = this.stompClient!.subscribe('/topic/lowStockUpdate', (message) => {
        // Validar mensaje
        if (!message.body || isNaN(parseInt(message.body, 10))) {
          console.warn('Invalid WebSocket message:', message.body);
          return;
        }

        const newCount = parseInt(message.body, 10);
        const today = this.getLocalDate();

        // Evitar procesar el mismo valor repetidamente
        if (newCount === this.lastProcessedCount) {
          console.log('Ignoring duplicate count:', newCount);
          return;
        }

        if (newCount !== this.lowStockCount) {
          this.lowStockCount = newCount;
          this.lastProcessedCount = newCount;

          // Lógica para mostrar alerta:
          // - Si no se descartó hoy, mostrar si newCount > 0
          // - Si se descartó hoy, mostrar si newCount > 0 y diferente a dismissedCount
          if (this.dismissedDate !== today || this.dismissedCount === null) {
            this.showAlert = newCount > 0;
          } else {
            this.showAlert = newCount > 0 && newCount !== this.dismissedCount;
          }

          // Activar animación si se muestra
          if (this.showAlert) {
            this.animationState = 'enlarged';
            setTimeout(() => {
              this.animationState = 'normal';
            }, 200);
          }

          console.log('WebSocket update:', {
            newCount,
            lowStockCount: this.lowStockCount,
            showAlert: this.showAlert,
            dismissedDate: this.dismissedDate,
            dismissedCount: this.dismissedCount,
            today
          });
        }
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en WebSocket:', frame);
    };

    this.stompClient.onWebSocketError = (error) => {
      console.error('Error de conexión WebSocket:', error);
    };

    this.stompClient.activate();
  }

  goToLowStockList(): void {
    this.router.navigate(['/main-stock'], { queryParams: { view: 1 } });
  }

  dismiss(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const today = this.getLocalDate();
    const dismissInfo = {
      date: today,
      count: this.lowStockCount
    };
    localStorage.setItem('lowStockDismissInfo', JSON.stringify(dismissInfo));

    this.dismissedDate = today;
    this.dismissedCount = this.lowStockCount;
    this.showAlert = false;

    console.log('Dismissed:', { dismissedDate: this.dismissedDate, dismissedCount: this.dismissedCount });
  }

  private getLocalDate(): string {

    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.stompClient?.deactivate();
  }
}
