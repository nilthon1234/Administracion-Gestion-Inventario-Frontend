import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BotonAlertaComponent } from "../../../../../shared/components/button/boton-alerta/boton-alerta.component";

@Component({
  selector: 'app-main-usuario',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main-usuario.component.html',
  styleUrl: './main-usuario.component.css'
})
export class MainUsuarioComponent {

  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isLeftSidebarCollapsed = this.isLeftSidebarCollapsed();
    if (isLeftSidebarCollapsed) {
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  });


}
