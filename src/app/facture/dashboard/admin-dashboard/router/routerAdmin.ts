import { Routes } from "@angular/router";
import path from "path";
import { AdminConfigAppComponent } from "../components/admin-config-app/admin-config-app.component";
import { PaymentDashboardComponent } from "../components/payment-dashboard/payment-dashboard.component";
import { authAdminGuard } from "../../../../auth/guard/authAdminGuard.guard";
import { EventosNotificacionesComponent } from "../components/eventos-notificaciones/eventos-notificaciones.component";
import { GananciasInformeComponent } from "../components/ganancias-informe/ganancias-informe.component";

export const RouterAdmin : Routes = [
    {
        path: '',
        component: AdminConfigAppComponent,
        children: [
            { path: '', redirectTo: 'filter-slipper', pathMatch: 'full'},
            { path: 'diagrama',title: 'Informaciones de la Tienda', component: PaymentDashboardComponent,canActivate: [authAdminGuard]},
            { path: 'ganancia',title: 'Informaciones de Ganancias', component: GananciasInformeComponent,canActivate: [authAdminGuard]},
            {path: 'event-notificaciones', title: 'Notificaciones de Eventos', component:EventosNotificacionesComponent,canActivate:[authAdminGuard]}
            //,canActivate: [authAdminGuard]
        ]
        
    }
]