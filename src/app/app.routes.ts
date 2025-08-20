
import { Routes } from '@angular/router';
import { LoginAdminComponent } from './facture/dashboard/admin-dashboard/components/login-admin/login-admin.component';
import { HomeInicioComponent } from './facture/dashboard/usuario-dashboard/components/home-inicio/home-inicio.component';

export const routes: Routes = [
    
            { path: 'login-admin', component:LoginAdminComponent },
            { path: 'welcome', component: HomeInicioComponent },
    

];