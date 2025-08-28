import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import  {  BrowserAnimationsModule, provideAnimations  }  from  '@angular/platform-browser/animations' ;
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch} from '@angular/common/http';
import { routerUsuario } from './facture/dashboard/usuario-dashboard/router/routerUsuario';
import { RouterAdmin } from './facture/dashboard/admin-dashboard/router/routerAdmin';

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    
    provideClientHydration(withEventReplay()),
    //ng build --configuration production
    //eneable http get,put,post,delete
    RouterModule,
    provideHttpClient(
      withFetch(),
    ), //post,put,delete,set
    
    //obligatorio para el token
    
    provideToastr(),
    provideAnimations(),
    provideRouter(routerUsuario),
    provideRouter(RouterAdmin),
    
  ]
};
