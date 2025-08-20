import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class LocalStoraService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  setToken(token: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('token', token);
        return true;
      } catch (error) {
        console.error('Error al guradar token en localstorage:', error);
        return false;
      }
    }
    return false;

  }

  getToken(): string | null {

    if(isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem('token');
      }catch (error){
        console.error('Error al obtener token desde localStorage:', error)
      }
    }
    return null;
  }

  removeToken() {

    if(isPlatformBrowser(this.platformId)){
      try{
        localStorage.removeItem('token');
      }catch (error){
        console.error('Error al eliminar token desde localStorage:', error);
        return false;
      }
    }
    return false;
  }

}
