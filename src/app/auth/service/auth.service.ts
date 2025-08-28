import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
   private readonly STATIC_USERNAME = 'Admin';
  private readonly STATIC_PASSWORD = 'Admin';
  private readonly SESSION_DURATION = 60 * 60 * 1000; // 1 hora en milisegundos

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private loginTimestamp: number | null = null;
  private sessionTimer: any;

  constructor(private router: Router) {
    this.checkExistingSession();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(username: string, password: string): boolean {
    if (username === this.STATIC_USERNAME && password === this.STATIC_PASSWORD) {
      this.loginTimestamp = Date.now();
      this.isAuthenticatedSubject.next(true);
      this.startSessionTimer();
      return true;
    }
    return false;
  }

  logout(): void {
    this.loginTimestamp = null;
    this.isAuthenticatedSubject.next(false);
    this.clearSessionTimer();
    this.router.navigate(['/filter-slipper']);
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      this.logout();
    }, this.SESSION_DURATION);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  private checkExistingSession(): void {
    if (this.loginTimestamp) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - this.loginTimestamp;
      
      if (elapsedTime >= this.SESSION_DURATION) {
        this.logout();
      } else {
        this.isAuthenticatedSubject.next(true);
        const remainingTime = this.SESSION_DURATION - elapsedTime;
        this.sessionTimer = setTimeout(() => {
          this.logout();
        }, remainingTime);
      }
    }
  }

  getRemainingTime(): number {
    if (!this.loginTimestamp) return 0;
    const elapsedTime = Date.now() - this.loginTimestamp;
    return Math.max(0, this.SESSION_DURATION - elapsedTime);
  }
  

}
