import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { BotonAlertaComponent } from "../../button/boton-alerta/boton-alerta.component";

@Component({
  selector: 'app-left-sidebar-usuario',
  imports: [CommonModule, RouterModule, BotonAlertaComponent],
  templateUrl: './left-sidebar-usuario.component.html',
  styleUrl: './left-sidebar-usuario.component.css'
})
export class LeftSidebarUsuarioComponent {

  constructor(private router: Router){}

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();
  items = [
    {
      routeLink: 'filter-slipper',
      icon: 'fal fa-home',
      label: 'Almacen',
      children: ['/filter-slipper', '/filter-sandal', '/filter-go-ca-me', '/filter-ropas']
    },
    {
      routeLink: 'filter-vitrina',
      icon: 'fal fa-vector-square',
      label: 'Vitrinas',
      children: ['/filter-vitrina','/filter-vitrina-b']
    },
    {
      routeLink: 'main-venta',
      icon: 'fal fa-box-open',
      label: 'Venta',
      children: ['/main-scanner','/filter-venta','/main-venta','/update-venta','/register-venta','/productos-ventas']
    },
    {
      routeLink: 'main-client-separation-amortization',
      icon: 'fal fa-file',
      label: 'Separaciones',
      children: ['/main-client-separation-amortization','/register-separation','/register-amortization']
    },
    {
      routeLink: 'main-pagos',
      icon: 'fal fa-money-bill-wave',
      label: 'Pagos',
      children: ['/main-pagos', '/informe-pagos-actualizados', '/main-informe-ventas-pagos', '/devoluciones']
    },
    {
      routeLink: 'main-gastos',
      icon: 'fas fa-chart-line',
      label: 'Gastos de Tienda',
      children: ['/main-gastos']
    },
    {
      routeLink: 'main-stock',
      icon: 'fas fa-minus-circle',
      label: 'Stock',
      children: ['/main-stock', '/stock-vitrina', '/stock-vitrina-b']
    },
    {
      routeLink: 'list-vitrina-visual',
      icon: 'far fa-eye',
      label: 'Observaciones',
      children: ['/list-vitrina-visual', '/list-vitrinaB-visual']
    },
    {
      routeLink: 'main-mantenimiento',
      icon: 'fal fa-cog',
      label: 'Mantenimiento',
      children: ['/main-mantenimiento', '/personalizar-qr','/main-vitrinas','/main-pro-gen']
    },
    {
      routeLink: 'login-admin',
      icon: 'fal fa-user-shield',
      label: 'Login Admin',
    },
    
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  isItemActive(item: any): boolean {
    const currentUrl = this.router.url;

    if (item.children) {
      return item.children.some((childRoute: string) => currentUrl.startsWith(childRoute));
    }

    return currentUrl === '/' + item.routeLink;
  }


}
