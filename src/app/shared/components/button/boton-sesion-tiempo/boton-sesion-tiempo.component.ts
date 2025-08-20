import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/service/auth.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-boton-sesion-tiempo',
  imports: [],
  templateUrl: './boton-sesion-tiempo.component.html',
  styleUrl: './boton-sesion-tiempo.component.css'
})
export class BotonSesionTiempoComponent implements OnInit,OnDestroy {

 remainingTime = 0;
  private timerInterval: any;
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Escuchar cambios en autenticación
    this.authService.isAuthenticated$.subscribe(auth => {
      this.isAuthenticated = auth;
      if (auth) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    });

    // Inicializar tiempo restante
    this.remainingTime = this.authService.getRemainingTime();
  }

  startTimer(): void {
    this.stopTimer(); // Evita múltiples intervalos

    this.timerInterval = setInterval(() => {
      this.remainingTime = this.authService.getRemainingTime();
      if (this.remainingTime <= 0 && this.isAuthenticated) {
        this.authService.logout(); // Cerrar sesión si se acaba el tiempo
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  logout(): void {
    this.authService.logout();
  }

}
