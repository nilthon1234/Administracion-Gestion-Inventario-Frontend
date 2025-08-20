import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { PagoService } from '../../../../service/pago.service';
import { InformePagos } from '../../../../../shared/models/InformePagos';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { PayTypeTranslatePipe } from '../../../../../shared/pipes/pay-type-translate.pipe';
import { CustomDateFormatPipe } from '../../../../../shared/pipes/custom-date-format.pipe';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-informe-pagos-actualizados',
  imports: [PayTypeNavbarComponent,CopiarTextoDirective,CommonModule,PayTypeTranslatePipe,CustomDateFormatPipe],
  templateUrl: './informe-pagos-actualizados.component.html',
  styleUrl: './informe-pagos-actualizados.component.css'
})
export class InformePagosActualizadosComponent implements OnInit {
  informePagos: InformePagos[] = [];


  constructor(private pagosService: PagoService, ){}

  ngOnInit(): void {
    this.listaInfoPagoActus();
  }

  listaInfoPagoActus(){
    this.pagosService.allListInformePagos().subscribe({
      next: (data: InformePagos[]) => {
        this.informePagos = data;
      },
      error:(err) => {
        console.error('Error al obtener Datos:', err);
      } 
    })
  }

}
