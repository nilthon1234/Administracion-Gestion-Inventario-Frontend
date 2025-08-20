import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStoraService } from '../../auth/service/local-stora.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';



export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) : Observable<HttpEvent<unknown>> => {

  const localStoraService = inject(LocalStoraService);
  const authService = inject(AuthService)
  const router = inject(Router);

  // Solo agregamos headers de autenticación si no es la ruta de validación de licencia
  if (!req.url.includes('/licencia/validar') && !req.url.includes('/licencia/verificar')) {
    const token = localStoraService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(req).pipe(
    catchError(error => {
      // Si hay un error 401 (No autorizado) o 403 (Prohibido)
      if (error.status === 401 || error.status === 403 && !authService.isAuthenticated)  {
        console.log('Interceptor: Error de autenticación, redirigiendo a validación');
        localStoraService.removeToken();
        router.navigate(['/validacion-licencia']);
      }
      return throwError(() => error);
    })
  );
};
