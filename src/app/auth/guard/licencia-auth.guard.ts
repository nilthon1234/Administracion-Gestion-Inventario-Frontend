import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, delay } from 'rxjs/operators';
import { LocalStoraService } from '../service/local-stora.service';
import { LicenciaService } from '../service/licencia.service';

@Injectable({
  providedIn: 'root'
})
export class LicenciaAuth implements CanActivate {
  constructor(
    private router: Router,
    private localStoraService: LocalStoraService,
    private licenciaService: LicenciaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(false);
    }

    const token = this.localStoraService.getToken();

    // Si no hay token, redirigir a validación
    if (!token) {
      this.router.navigate(['/validacion-licencia']);
      return of(false);
    }

    // Verificar si el token está expirado
    if (this.isTokenExpired(token)) {
      this.localStoraService.removeToken();
      this.router.navigate(['/validacion-licencia']);
      return of(false);
    }

    // Si hay token y no está expirado, verificar con el servidor
    return from(this.licenciaService.getFingerprint()).pipe(
      switchMap(fp => this.licenciaService.verificarToken(token, fp)),
      map(response => {
        if (response?.valid) {
          return true;
        }
        this.localStoraService.removeToken();
        this.router.navigate(['/validacion-licencia']);
        return false;
      }),
      catchError(() => {
        this.localStoraService.removeToken();
        this.router.navigate(['/validacion-licencia']);
        return of(false);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() > exp;
    } catch (e) {
      return true; // Si hay error al decodificar, considerar como expirado
    }
  }
}
