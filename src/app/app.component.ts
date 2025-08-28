import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BotonAlertaComponent } from "./shared/components/button/boton-alerta/boton-alerta.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 
}