import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { LeftSidebarUsuarioComponent } from "../../../../../shared/components/navbars/left-sidebar-usuario/left-sidebar-usuario.component";
import { MainUsuarioComponent } from "../main-usuario/main-usuario.component";

@Component({
  selector: 'app-usuario-config-apps',
  imports: [LeftSidebarUsuarioComponent, MainUsuarioComponent],
  templateUrl: './usuario-config-apps.component.html',
  styleUrl: './usuario-config-apps.component.css'
})
export class UsuarioConfigAppsComponent implements OnInit {

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
