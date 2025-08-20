import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-inicio',
  imports: [],
  templateUrl: './home-inicio.component.html',
  styleUrl: './home-inicio.component.css'
})
export class HomeInicioComponent {

  constructor(private router: Router) {}

  iniciarApp() {
    this.router.navigateByUrl('/filter-slipper');
  }

}
