import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { InitialSocketService } from './app/facture/service/initial-socket.service';
registerLocaleData(localeEs, 'es');

bootstrapApplication(AppComponent, appConfig).then(async appRef => {
  const splash = document.getElementById('splash-screen');
  const router = appRef.injector.get(Router);
  const wsService = appRef.injector.get(InitialSocketService);

  // 👇 Iniciamos la conexión al arrancar
  wsService.connect('MAQ02'); // aquí pones el ID de tu máquina

  try {
    // 👇 Esperamos hasta que connected$ emita true
    await firstValueFrom(wsService.connected$.pipe(filter(c => c === true)));
    console.log('✅ Conectado al WebSocket, ocultando splash');
  } catch (e) {
    console.error('❌ No se pudo conectar al WebSocket', e);
  }

  if (splash) {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 1000);
  }

  // 👇 Ahora sí redirigimos
  router.navigateByUrl('/welcome');
});
