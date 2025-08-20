import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './left-sidebar-admin.component.html',
  styleUrl: './left-sidebar-admin.component.css'
})
export class LeftSidebarAdminComponent {
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
      children: ['/main-venta','/update-venta','/register-venta']
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
      children: ['/main-mantenimiento', '/personalizar-qr', 'main-marcas']
    },
    {
      routeLink: 'event-notificaciones',
      icon: 'fal fa-bell',
      label: 'Notificaciones',
      children: ['/event-notificaciones', ]
    },
    {
      routeLink: 'diagrama',
      icon: 'fal fa-chart-bar',
      label: 'Graficas Rendimiento',
      children: ['/diagrama', ]
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
