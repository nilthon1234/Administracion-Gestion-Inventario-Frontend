import { Component, OnInit } from '@angular/core';
import { PayTypeNavbarComponent } from "../../../../../shared/components/navbars/pay-type-navbar/pay-type-navbar.component";
import { PagoService } from '../../../../service/pago.service';
import { VentasPagos } from '../../../../../shared/models/VentasPagos';
import { PayTypeTranslatePipe } from "../../../../../shared/pipes/pay-type-translate.pipe";
import { CustomDateFormatPipe } from "../../../../../shared/pipes/custom-date-format.pipe";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CopiarTextoDirective } from '../../../../../shared/directives/copiar-texto.directive';
import { PaginatedResponse } from '../../../../../shared/models/PaginatedResponse';

@Component({
  selector: 'app-informe-ventas-pagos',
  imports: [CommonModule,FormsModule,CopiarTextoDirective, PayTypeNavbarComponent, PayTypeTranslatePipe, CustomDateFormatPipe],
  templateUrl: './informe-ventas-pagos.component.html',
  styleUrl: './informe-ventas-pagos.component.css'
})
export class InformeVentasPagosComponent implements OnInit {
  ventasPagos: VentasPagos[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  constructor(private servicePago: PagoService) { }

  ngOnInit(): void {
    this.cargarVentaPagos();
  }

  cargarVentaPagos(): void {
    this.servicePago.getAllVentaPagos(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: PaginatedResponse<VentasPagos>) => {
          this.ventasPagos = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
        },
        error: (err) => {
          console.error('Error al cargar pagos', err);
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarVentaPagos();
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 0;
    this.cargarVentaPagos();
  }

}
