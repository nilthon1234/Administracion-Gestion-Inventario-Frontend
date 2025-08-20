import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { PagoService } from '../../../../service/pago.service';
import { VentasPagos } from '../../../../../shared/models/VentasPagos';
import { PayTypeTranslatePipe } from "../../../../../shared/pipes/pay-type-translate.pipe";
import { CustomDateFormatPipe } from "../../../../../shared/pipes/custom-date-format.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';

@Component({
  selector: 'app-informe-ventas-pagos',
  imports: [CommonModule,FormsModule,CopiarTextoDirective, PayTypeNavbarComponent, PayTypeTranslatePipe, CustomDateFormatPipe],
  templateUrl: './informe-ventas-pagos.component.html',
  styleUrl: './informe-ventas-pagos.component.css'
})
export class InformeVentasPagosComponent implements OnInit {
  ventasPagos: VentasPagos[] = [];

  constructor(private servicePago: PagoService){}
  ngOnInit(): void {

    this.listaVentaPago();
  }
  listaVentaPago(){
    this.servicePago.allListVentaPagos().subscribe({
      next: (data: VentasPagos[]) => {
          this.ventasPagos = data;
      },
      error: (err) =>{
        console.error('Error a listar Venta', err)
      },
    });
  };

}
