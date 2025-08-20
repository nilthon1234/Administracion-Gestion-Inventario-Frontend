import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { Devoluciones } from '../../../../../shared/models/devoluciones';
import { DevolucionesService } from '../../../../service/devoluciones.service';
import { CommonModule } from '@angular/common';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { HighlightPipe } from '../../../../../shared/pipes/highlight.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-devoluciones',
  imports: [PayTypeNavbarComponent,CommonModule,PayTypeTranslatePipe,CustomDateFormatPipe,CopiarTextoDirective],
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.css'
})
export class DevolucionesComponent implements OnInit{
  devoluciones: Devoluciones[] = []

  constructor(private devolucionesService: DevolucionesService){}

   ngOnInit(): void {
    this.listaDevoluciones();
  }

  listaDevoluciones(){
    this.devolucionesService.allListaDevoluciones().subscribe({
      next: (data: Devoluciones[]) => {
        this.devoluciones = data;
      },
      error: (err) =>{
        console.error('Error al listar Devoluciones', err)
      },
    });
  };

}
