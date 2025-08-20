import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';

import { LeftSidebarAdminComponent } from '../../../../../shared/components/navbars/left-sidebar-admin/left-sidebar-admin.component';
import { MainAdminComponent } from '../main-admin/main-admin.component';

@Component({
  selector: 'app-admin-config-app',
  imports: [LeftSidebarAdminComponent,MainAdminComponent],
  templateUrl: './admin-config-app.component.html',
  styleUrl: './admin-config-app.component.css'
})
export class AdminConfigAppComponent {
  screenWidth = signal<number>(0); // Inicializamos con un valor predeterminado.
  isLeftSidebarCollapsed = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object,) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      if (this.screenWidth() < 768) {
        this.isLeftSidebarCollapsed.set(true);
      }
    }
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

}
